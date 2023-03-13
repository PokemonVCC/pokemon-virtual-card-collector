import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/blur.css';

import { 
    Container,
    Title,
    Info,
    Collapse,
    List,
    NoList,
    Inspector
} from './CardList.styled';
import Card from './Card';

import {
    getSetsByUserId,
    getCardsByUserIdAndSetTcgId,
    getSetCountByUserIdAndSetTcgId,
    getSetPointsByUserIdAndSetTcgId,
    getSetValueByUserIdAndSetTcgId
} from '../../services/card.service';

export default function CardList({ cardWidth = '180px', groupedBySet = false }) {
    const [reloadListRequested, setReloadListRequested] = useState(true);
    const [reloadItemRequested, setReloadItemRequested] = useState(undefined);
    const [data, setData] = useState(undefined);
    const [collapsed, setCollapsed] = useState({});
    const [cardTakenOut, setCardTakenOut] = useState(undefined);
    const inspectorRef = useRef(null);

    useEffect(() => {
        async function getMoreSets(userId) {
            const newData = await getSetsByUserId(userId);

            for(let i = 0; i < newData.length; i++) {
                toggleCollapse(newData[i].tcg_id, true);
            }

            setData(newData);
            setReloadListRequested(false);
        }

        async function getSingleSetCards(userId, setTcgId) {
            const newData = await getCardsByUserIdAndSetTcgId(userId, setTcgId);
            newData.points = await getSetPointsByUserIdAndSetTcgId(userId, setTcgId);
            newData.value = await getSetValueByUserIdAndSetTcgId(userId, setTcgId);

            setData(newData);
            setReloadListRequested(false);
        }

        if(reloadListRequested) {
            if(groupedBySet) {
                getMoreSets('12d54634c5fecaa35e998cb749fde732');
            }
            else {
                getSingleSetCards('12d54634c5fecaa35e998cb749fde732', 'xy6');
            }
        }
    }, [reloadListRequested, groupedBySet]);

    useEffect(() => {
        async function getSetCards(userId, setTcgId) {
            const cardsData = await getCardsByUserIdAndSetTcgId(userId, setTcgId);

            const newData = data.map((x) => {
                if(x.tcg_id === setTcgId) {
                    x.cards = cardsData.cards;
                }

                return x;
            });

            setData(newData);
        }

        async function getSetInfo(userId, setTcgId) {
            const count = await getSetCountByUserIdAndSetTcgId(userId, setTcgId);
            const points = await getSetPointsByUserIdAndSetTcgId(userId, setTcgId);
            const value = await getSetValueByUserIdAndSetTcgId(userId, setTcgId);

            const newData = data.map((x) => {
                if(x.tcg_id === setTcgId) {
                    x.count = count;
                    x.points = points;
                    x.value = value;
                }

                return x;
            })

            setData(newData);

            getSetCards(userId, setTcgId);

            setReloadItemRequested(undefined);
        }

        if(reloadItemRequested) {
            getSetInfo('12d54634c5fecaa35e998cb749fde732', reloadItemRequested);
        }
    }, [reloadItemRequested]);

    function getListOfCards(setId, cards, count) {
        const allCards = cards;
        let lastIndex = 0;

        for(let i = 0; i < count; i++) {
            const index = allCards.findIndex(x => x.number === i + 1);

            if(index === -1) {
                allCards.splice(lastIndex, 0, { number: i + 1, key: setId + (i + 1) });
                lastIndex++;
            }
            else {
                lastIndex = index + 1;
            }

        }

        return allCards.map(x => {
            if(!x.images) {
                return (
                    <Card cardWidth={cardWidth}
                        number={x.number}
                        isMissing={true}
                        key={x.key} />
                );
            }

            return (
                <Card cardWidth={cardWidth} 
                    number={x.number}
                    type={x.types ? x.types[0] : 'Colorless'}
                    lowResImage={x.images.small}
                    hiResImage={x.images.large}
                    onCardTakenOut={onCardTakenOut}
                    key={x.ids[0]} />
            );
        });
    }

    function toggleCollapse(setId, collapsed) {
        if(!collapsed) {
            setReloadItemRequested(setId);
        }

        setCollapsed(prev => {
            prev[setId] = collapsed;
            
            return {
                ...prev
            };
        });
    }

    function onCardTakenOut(image) {
        setCardTakenOut(image);
        
        document.body.style.overflow = 'hidden';
    }

    function onInspectorCardMouseOver(e) {
        inspectorRef.current.querySelector('.image').style.border = '1px solid red';
    }

    if(groupedBySet && data) {
        const setList = data.map(x => {
            const list = x.cards && x.count ? getListOfCards(x.tcg_id, x.cards, x.count.total) : null;

            return (
                <Container key={x.tcg_id}>
                    <Title>
                        <img src={x.images.logo} />
                        {collapsed[x.tcg_id] ? (
                            x.points && x.value && x.count ? (
                                <Info>
                                    <span>{x.count.found}/{x.count.total} cards</span>
                                    <span>{x.points.total} points</span>
                                    <span>€ {x.value.total}</span>
                                </Info>
                            ) : (
                                <Info>Open to view more info</Info>
                            )
                        ): (
                            x.points && x.value && x.count ? (
                                <Info>
                                    <span>{x.count.found}/{x.count.total} cards</span>
                                    <span>{x.points.total} points</span>
                                    <span>€ {x.value.total}</span>
                                </Info>
                            ) : (
                                <Info>Loading...</Info>
                            )
                        )}
                        <Collapse onClick={() => toggleCollapse(x.tcg_id, !collapsed[x.tcg_id])}>
                            {collapsed[x.tcg_id] ? (
                                <FontAwesomeIcon icon={solid('chevron-down')} />
                            ): (
                                <FontAwesomeIcon icon={solid('chevron-up')} />
                            )}
                        </Collapse>
                    </Title>
                    {!collapsed[x.tcg_id] ? (
                        list ? (
                            <List cardWidth={cardWidth}>
                                {list}
                            </List>
                        ) : (
                            <NoList>Loading...</NoList>
                        )
                    ) : null}
                </Container>
            )
        });
        
        return (
            <div>
                {setList}
                {cardTakenOut ? (
                    <Inspector cardWidth={cardWidth}
                        ref={inspectorRef}>
                        <LazyLoadImage className='image'
                            wrapperClassName='wrapper_image'
                            src={cardTakenOut}
                            effect='blur'
                            onMouseOver={onInspectorCardMouseOver} />
                    </Inspector>
                ) : null}
            </div>
        );
    }
    else if(data) {
        const list = getListOfCards(data.set.ids[0], data.cards, data.set.total_cards);

        return (
            <Container>
                <Title>
                    <img src={data.set.images.logo} />
                    {data.points && data.value ? (
                        <Info>
                            <span>{data.cards_count}/{data.set.total_cards} cards</span>
                            <span>{data.points.total} points</span>
                            <span>€ {data.value.total}</span>
                        </Info>
                    ) : (
                        <Info>
                            <span>Loading...</span>
                        </Info>
                    )}
                </Title>
                <List cardWidth={cardWidth}>
                    {list}
                </List>
            </Container>
        )
    }
}