import { useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
    Container,
    ContainerInteractive,
    Overlay,
    Number
} from './Card.styled';

export default function Card({ cardWidth, number, type, lowResImage, hiResImage, isMissing = false, onCardTakenOut }) {
    const containerRef = useRef(null);

    function getCardColor() {
        switch(type) {
            case 'Colorless': return '#A8A77A';
            case 'Darkness': return '#705746';
            case 'Dragon': return '#6F35FC';
            case 'Fairy': return '#D685AD';
            case 'Fighting': return '#C22E28';
            case 'Fire': return '#EE8130';
            case 'Grass': return '#7AC74C';
            case 'Lightning': return '#F7D02C';
            case 'Metal': return '#B7B7CE';
            case 'Psychic': return '#F95587';
            case 'Water': return '#6390F0';
            default:
                console.error('No color found for ' + type);
                return '#A8A77A';
        }
    }

    function onContainerMouseEnter(e) {
        containerRef.current.classList.add('hovered');
    }

    function onContainerMouseLeave(e) {
        containerRef.current.classList.remove('hovered');
    }

    function onContainerClick(e) {
        containerRef.current.classList.add('taken_out');

        setTimeout(() => {
            onCardTakenOut(hiResImage);
        }, 6 * 100);
    }

    if(isMissing) {
        lowResImage = 'https://tcg.pokemon.com/assets/img/global/tcg-card-back.jpg';

        return (
            <Container cardWidth={cardWidth}
                placeholderColor={'#3c5aa6'}>
                <Overlay>
                    <Number>{number}</Number>
                </Overlay>
                <LazyLoadImage className='image' 
                    src={lowResImage} />
            </Container>
        );
    }

    return (
        <ContainerInteractive ref={containerRef} 
            cardWidth={cardWidth}
            placeholderColor={getCardColor()}
            onMouseEnter={onContainerMouseEnter}
            onMouseLeave={onContainerMouseLeave}
            onClick={onContainerClick}>
            <LazyLoadImage className='image'
                wrapperClassName='wrapper_image'
                src={lowResImage} />
        </ContainerInteractive>
    );
}