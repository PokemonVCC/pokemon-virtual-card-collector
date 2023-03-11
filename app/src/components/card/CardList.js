import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import styled from 'styled-components';

import Card from './Card';

const Container = styled.div`
    position: relative;
    width: 100%;

    &:not(:first-child) {
        margin-top: 24px;
    }
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding: 12px;
    border-radius: 5px;
    user-select: none;

    &:hover,
    &:active {
        background-color: #e8e8e8;
    }

    & img {
        height: 96px;
        width: auto;
    }
`;

const Info = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 24px;

    & span {
        padding: 12px;
        background-color: #e8e8e8;
        border-radius: 5px;
        font-size: 20px;
        font-weight: 500;
        
        &:not(:first-child) {
            margin-left: 12px;
        }
    }
`;

const Collapse = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    border-radius: 24px;

    &:hover {
        background-color: rgba(0, 0, 0, .1);
        cursor: pointer;
    }
`;

const List = styled.div`
    --container-width: calc(${props => props.cardWidth} + 24px);
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--container-width));
    width: 100%;
`;

export default function CardList({ cardWidth = '180px', groupedBySet = false }) {
    const [reloadRequested, setReloadRequested] = useState(true);
    const [data, setData] = useState(undefined);
    const [collapsed, setCollapsed] = useState({});

    useEffect(() => {
        async function getCards(userId, setId) {
            const url = `http://localhost:5000/card/list/${userId}/${setId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();

                json.data.points = await getPoints(userId, setId);
                json.data.value = await getValue(userId, setId);

                if(groupedBySet) {
                    json.data.set_id = setId;

                    toggleCollapse(setId, true);

                    return json.data;
                }
                else {
                    setData(json.data);
                    setReloadRequested(false);
                }
            }
        }

        async function getSets(userId) {
            const url = `http://localhost:5000/set/list/${userId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();

                const sets = [];

                for(let i = 0; i < json.data.length; i++) {
                    sets.push(await getCards(userId, json.data[i]));
                }

                setData(sets);
                setReloadRequested(false);
            }
        }

        async function getPoints(userId, setId) {
            const url = `http://localhost:5000/card/points/${userId}/${setId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();
                return json.data;
            }
        }

        async function getValue(userId, setId) {
            const url = `http://localhost:5000/card/value/${userId}/${setId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();
                return json.data;
            }
        }

        if(reloadRequested) {
            if(groupedBySet) {
                getSets('12d54634c5fecaa35e998cb749fde732');
            }
            else {
                getCards('12d54634c5fecaa35e998cb749fde732', 'xy6');
            }
        }
    }, [reloadRequested, groupedBySet]);

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
                    lowResImage={x.images.small}
                    hiResImage={x.images.large}
                    key={x.ids[0]} />
            );
        });
    }

    function toggleCollapse(setId, collapsed) {
        setCollapsed(prev => {
            prev[setId] = collapsed;
            
            return {
                ...prev
            };
        });
    }

    if(groupedBySet && data) {
        return data.map(x => {
            const list = getListOfCards(x.set.ids[0], x.cards, x.set.total_cards);

            return (
                <Container key={x.set.ids[0]}>
                    <Title>
                        <img src={x.set.images.logo} />
                        {x.points && x.value ? (
                            <Info>
                                <span>{x.cards_count}/{x.set.total_cards} cards</span>
                                <span>{x.points.total} points</span>
                                <span>€ {x.value.total}</span>
                            </Info>
                        ) : (
                            <Info>
                                <span>Loading...</span>
                            </Info>
                        )}
                        <Collapse onClick={() => toggleCollapse(x.set_id, !collapsed[x.set_id])}>
                            {x.set_id ? (
                                collapsed[x.set_id] ? (
                                    <FontAwesomeIcon icon={solid('chevron-down')} />
                                ): (
                                    <FontAwesomeIcon icon={solid('chevron-up')} />
                                )
                            ) : (
                                <FontAwesomeIcon icon={solid('chevron-down')} />
                            )}
                        </Collapse>
                    </Title>
                    {!collapsed[x.set_id] ? (
                        <List cardWidth={cardWidth}>
                            {list}
                        </List>
                    ) : null}
                </Container>
            )});
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