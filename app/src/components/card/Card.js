import { useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    --width: ${props => props.cardWidth};
    --border-radius: 5px;
    --scale: 2.4;
    --aspect-ratio: auto 1 / 1.4142135623730950488016887242097;
    --box-shadow-idle: 0 0 3px 1px inset rgba(86,154,226, .5);
    --box-shadow-hovered: 0 6px 12px rgba(0, 0, 0, .3), 0 3px 3px rgba(0, 0, 0, .1);

    position: relative;
    padding: 12px;
    width: calc(var(--container-width));
    border: 1px dotted rgb(86,154,226);
    border-radius: none;
    user-select: none;

    &:after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        background: linear-gradient(to right bottom, rgba(86,154,226, .3) 20%, transparent 40%, rgba(86,154,226, .3) 80%, transparent);
        box-shadow: var(--box-shadow-idle);
        content: '';
        transition: .1s;
    }
`;

const ContainerInteractive = styled(Container)`
    &.hovered {
        cursor: pointer;
        z-index: 998;

        &:after {
            z-index: 998;
            transition-delay: .9s;
        }

        & .image {
            --image: var(--image-hi-res);

            position: absolute;
            box-shadow: var(--box-shadow-hovered);
            transform: scale(var(--scale));
            animation: takeCardOut 1.2s;
            z-index: 999;
        }

        @keyframes takeCardOut {
            from {
                margin-top: 0;
                box-shadow: var(--box-shadow-idle);
                transform: scale(1);
                z-index: 1;
            }
            70% {
                margin-top: -140%;
                box-shadow: var(--box-shadow-idle);
                transform: scale(1);
                z-index: 999;
            }
            to {
                margin-top: 0;
                box-shadow: var(--box-shadow-hovered);
                transform: scale(var(--scale));
                z-index: 999;
            }
        }
    }
`;

const Image = styled.div`
    --image-low-res: url(${props => props.lowRes});
    --image-hi-res: url(${props => props.hiRes});
    --image: var(--image-low-res);

    margin-top: 0;
    width: var(--width);
    aspect-ratio: var(--aspect-ratio);
    background: var(--image);
    background-position: center;
    background-size: cover;
    border-radius: var(--border-radius);
    box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
    transition: .1s;
`;

const BackImage = styled(Image).attrs(props => ({
    lowRes: 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg'
}))``;

const Overlay = styled.div`
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--width);
    aspect-ratio: var(--aspect-ratio);
    background-color: rgba(0, 0, 0, .6);
    border-radius: var(--border-radius);
`;

const Number = styled.span`
    font-size: 60px;
    font-weight: 700;
    color: white;
    opacity: .8;
`;

export default function Card({ cardWidth, number, lowResImage, hiResImage, isMissing = false }) {
    const containerRef = useRef(null);

    function onContainerMouseEnter(e) {
        containerRef.current.classList.add('hovered');
    }

    function onContainerMouseLeave(e) {
        containerRef.current.classList.remove('hovered');
    }

    function onContainerClick(e) {
        containerRef.current.classList.add('focused');
    }

    if(isMissing) {
        return (
            <Container cardWidth={cardWidth}>
                <Overlay>
                    <Number>{number}</Number>
                </Overlay>
                <BackImage />
            </Container>
        );
    }

    return (
        <ContainerInteractive ref={containerRef} 
            cardWidth={cardWidth}
            onMouseEnter={onContainerMouseEnter}
            onMouseLeave={onContainerMouseLeave}
            onClick={onContainerClick}>
            <Image className='image' 
                lowRes={lowResImage}
                hiRes={hiResImage} />
        </ContainerInteractive>
    );
}