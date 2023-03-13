import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    width: 100%;

    &:not(:first-child) {
        margin-top: 24px;
    }
`;

export const Title = styled.div`
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

export const Info = styled.div`
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

export const Collapse = styled.div`
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

export const List = styled.div`
    --container-width: calc(${props => props.cardWidth} + 24px);
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--container-width));
    width: 100%;
`;

export const NoList = styled.div`
    text-align: center;
`;

export const Inspector = styled.div`
    --width: calc(${props => props.cardWidth} * 2.4);
    --border-radius: 21px;
    --aspect-ratio-factor: 1.4142135623730950488016887242097;
    --aspect-ratio: 1 / var(--aspect-ratio-factor);
    --box-shadow: 0 0 3px -1px transparent, 0 0 2px 1px transparent, 0 0 5px 0px transparent, 0px 10px 20px -5px black, 0 2px 15px -5px black, 0 0 20px 0px transparent;

    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);

    & .wrapper_image {
        perspective: 600px;
        perspective-origin: center;
    }

    & .image {
        width: var(--width);
        aspect-ratio: var(--aspect-ratio);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        animation: fadeIn .6s;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(1.2);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;