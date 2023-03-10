import { useState, useEffect } from 'react';
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    & img {
        height: 96px;
        width: auto;
    }

    & span {
        font-size: 24px;
        font-weight: 500;
    }
`;

const List = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, ${props => props.cardWidth});
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    width: 100%;
`;

export default function CardList({ cardWidth = '180px', groupedBySet = false }) {
    const [reloadRequested, setReloadRequested] = useState(true);
    const [data, setData] = useState(undefined);

    useEffect(() => {
        async function getCards(userId, setId) {
            const url = `https://dazorn96-zany-train-9pvvp79qp9fpvxv-5000.preview.app.github.dev/card/list/${userId}/${setId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();

                if(groupedBySet) {
                    return json.data;
                }
                else {
                    setData(json.data);
                    setReloadRequested(false);

                    await getPoints(userId, setId);
                }
            }
        }

        async function getSets(userId) {
            const url = `https://dazorn96-zany-train-9pvvp79qp9fpvxv-5000.preview.app.github.dev/set/list/${userId}`;
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
            const url = `https://dazorn96-zany-train-9pvvp79qp9fpvxv-5000.preview.app.github.dev/card/points/${userId}/${setId}`;
            const response = await fetch(url);

            if(response.ok) {
                const json = await response.json();

                console.log(data);
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

    function getListOfCards(cards, count) {
        const allCards = cards;
        let lastIndex = 0;

        for(let i = 0; i < count; i++) {
            const index = allCards.findIndex(x => x.number === i + 1);

            if(index === -1) {
                allCards.splice(lastIndex, 0, { number: i + 1 });
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
                        key={x.number} />
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

    if(groupedBySet && data) {
        return data.map(x => {
            const list = getListOfCards(x.cards, x.set.total_cards);
            return (
                <Container>
                    <Title>
                        <img src={x.set.images.logo} />
                        <span>{x.cards_count}/{x.set.total_cards}</span>
                    </Title>
                    <List cardWidth={cardWidth}>
                        {list}
                    </List>
                </Container>
            )});
    }
    else if(data) {
        const list = getListOfCards(data.cards, data.set.total_cards);

        return (
            <Container>
                <Title>
                    <img src={data.set.images.logo} />
                    <span>{data.cards_count}/{data.set.total_cards}</span>
                </Title>
                <List cardWidth={cardWidth}>
                    {list}
                </List>
            </Container>
        )
    }
}