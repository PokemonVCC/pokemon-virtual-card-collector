import styled from 'styled-components';

export const Container = styled.div`
    --width: ${props => props.cardWidth};
    --border-radius: 8px;
    --scale: 2.4;
    --aspect-ratio-factor: 1.4142135623730950488016887242097;
    --aspect-ratio: 1 / var(--aspect-ratio-factor);
    --box-shadow-slip: 0 0 3px 1px inset rgba(86,154,226,0.5), 0 -12px 24px inset rgba(86,154,226,.75);
    --box-shadow-card: 0 3px 6px rgba(0, 0, 0, .3);
    --margin-top-on-click: calc(-1 * var(--width) * var(--aspect-ratio-factor) - 24px);
    --z-index-on-click: 998;

    position: relative;
    padding: 12px;
    padding-bottom: 6px;
    width: calc(var(--container-width));
    background-color: rgba(0, 0, 0, .025);
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
        box-shadow: var(--box-shadow-slip);
        content: '';
        transition: .1s;
    }

    & .wrapper_image {
        display: block !important;
    }

    & .wrapper_image:not(.lazy-load-image-loaded) {
        background-color: ${props => props.placeholderColor};

        & .image {
            opacity: 0;
        }
    }

    & .wrapper_image.lazy-load-image-loaded {
        & .image {
            opacity: 1;
            transition: .1s;
        }
    }

    & .image {
        margin-top: 0;
        width: var(--width);
        aspect-ratio: var(--aspect-ratio);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow-card);
        transition: .1s;
    }
`;

export const ContainerInteractive = styled(Container)`
    &.hovered {
        cursor: pointer;

        & .image {
            animation: cardHovered 1.2s infinite;
        }

        @keyframes cardHovered {
            from {
                margin-top: 0;
            }
            50% {
                margin-top: -5px;
            }
            to {
                margin-top: 0;
            }
        }
    }

    &.taken_out {
        & .wrapper_image {
            animation: takeCardOut .6s linear;
            opacity: 0;
        }

        @keyframes takeCardOut {
            from {
                margin-top: 0;
                opacity: 1;
                z-index: 1;
            }
            50% {
                margin-top: var(--margin-top-on-click);
                transform: none;
                opacity: 1;
                z-index: var(--z-index-on-click);
            }
            to {
                margin-top: var(--margin-top-on-click);
                transform: scale(var(--scale));
                opacity: 0;
                z-index: var(--z-index-on-click);
            }
        }
    }
`;

export const Overlay = styled.div`
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

export const Number = styled.span`
    font-size: 60px;
    font-weight: 700;
    color: white;
    opacity: .8;
`;