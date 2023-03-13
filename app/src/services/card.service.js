export async function getCardsByUserIdAndSetTcgId(userId, setTcgId) {
    const url = `http://localhost:5000/card/list/${userId}/${setTcgId}`;
    const response = await fetch(url);
    const json = await response.json();
    
    if(response.ok) {
        return json.data;
    }
    else {
        throw new Error(json.message);
    }
}

export async function getSetCountByUserIdAndSetTcgId(userId, setTcgId) {
    const url = `http://localhost:5000/card/count/${userId}/${setTcgId}`;
    const response = await fetch(url);
    const json = await response.json();

    if(response.ok) {
        return json.data;
    }
    else {
        throw new Error(json.message);
    }
}

export async function getSetPointsByUserIdAndSetTcgId(userId, setTcgId) {
    const url = `http://localhost:5000/card/points/${userId}/${setTcgId}`;
    const response = await fetch(url);
    const json = await response.json();

    if(response.ok) {
        return json.data;
    }
    else {
        throw new Error(json.message);
    }
}

export async function getSetValueByUserIdAndSetTcgId(userId, setTcgId) {
    const url = `http://localhost:5000/card/value/${userId}/${setTcgId}`;
    const response = await fetch(url);
    const json = await response.json();

    if(response.ok) {
        return json.data;
    }
    else {
        throw new Error(json.message);
    }
}

export async function getSetsByUserId(userId) {
    const url = `http://localhost:5000/set/list/${userId}`;
    const response = await fetch(url);
    const json = await response.json();

    if(response.ok) {
        return json.data;
    }
    else {
        throw new Error(json.message);
    }
}