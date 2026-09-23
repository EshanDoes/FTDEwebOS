'use client'

import { useState, useEffect } from 'react';

export function Time(){
    const [time, setTime] = useState("");

    useEffect(() => {
        function updateTime(){
            setTime(new Date().toLocaleTimeString());
        }
        updateTime();
        setInterval(updateTime, 1000);
    }, [])
    return (
        <p
        style={{ marginRight: 16, verticalAlign: "center", position: "absolute", left: 2 }}
        id="time"
        className=""
        >
        {time}
        </p>
    );
}