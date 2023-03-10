import { useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
    user-select: none;
    transition: .1s;
`;

const ContainerInteractive = styled(Container)`
    &.hovered {
        cursor: pointer;
        transform: scale(1.2);
        box-shadow: 0 6px 12px rgba(0, 0, 0, .3), 0 3px 3px rgba(0, 0, 0, .1);
        z-index: 999;
        transition: .5s;
    }

    &.focused {
        animation: focus .5s linear;
    }

    @keyframes focus {
        from {
            margin-top: 0;
            opacity: 1;
        }

        to {
            margin-top: -300px;
            opacity: 0;
        }
    }
`;

const Image = styled.div`
    width: ${props => props.cardWidth};
    aspect-ratio: auto 1 / 1.4142135623730950488016887242097;
    background: url(${props => props.image});
    background-position: center;
    background-size: cover;
    border-radius: 5px;
`;

const BackImage = styled(Image).attrs(props => ({
    image: 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg'
}))``;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 100%;
    background-color: rgba(0, 0, 0, .75);
    border-radius: 5px;
`;

const Number = styled.span`
    font-size: 60px;
    font-weight: 700;
    color: white;
    opacity: .75;
`;

export default function Card({ cardWidth, number, lowResImage, hiResImage, isMissing = false }) {
    const containerRef = useRef(null);

    function onContainerMouseEnter(e) {
        // containerRef.current.classList.add('hovered');
    }

    function onContainerMouseLeave(e) {
        // containerRef.current.classList.remove('hovered');
    }

    function onContainerClick(e) {
        // containerRef.current.classList.add('focused');
    }

    if(isMissing) {
        return (
            <Container>
                <Overlay>
                    <Number>{number}</Number>
                </Overlay>
                <BackImage cardWidth={cardWidth} />
            </Container>
        );
    }

    return (
        <Container>
            <Image cardWidth={cardWidth} 
                image={lowResImage} />
        </Container>
    );
}