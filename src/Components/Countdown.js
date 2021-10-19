import React, { useState, useEffect, useRef } from 'react';

import './Countdown.scss';

const Countdown = () => {
    const [time, setTime] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [tenths, setTenths] = useState(0);

    const [initial, setInitial] = useState(true);
    const [play, setPlay] = useState(false);

    const minutesRef = useRef(null);

    useEffect(() => {
        setTime(60 * 1000 * minutes + 1000 * seconds + 100 * tenths);
    }, [minutes, seconds, tenths]);

    useEffect(() => {
        if (play) {
            const interval = setInterval(() => {
                setTime(time => time > 0 ? time - 100 : 0); 
                setInitial(false);
            }, 100);

            return () => clearInterval(interval);
        };
    }, [play]);

    useEffect(() => {
        if (initial) setStartTime(time);
        if (time === 0) minutesRef.current.focus();
    }, [time]);

    useEffect(() => {
        minutesRef.current.focus();
    }, []);

    const showMinutes = () => {
        let inMinutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        return inMinutes > 9 ? inMinutes : '0' + inMinutes;
    };

    const showSeconds = () => {
        let inSeconds = Math.floor((time % (1000 * 60)) / 1000);
        return inSeconds > 9 ? inSeconds : '0' + inSeconds;
    };

    const showTenths = () => Math.floor((time % 1000) / 100);

    const handleMinutes = e => {
        if (+e.target.value > 59) return;
        setMinutes(+e.target.value);
    };

    const handleSeconds = e => {
        if (+e.target.value > 59) return;
        setSeconds(+e.target.value);
    };

    const handleTenths = e => {
        if (+e.target.value > 9) return;
        setTenths(+e.target.value);
    };

    const handlePlayPause = () => {
        if (time === 0) return;
        setPlay(!play);
    };

    const handleReset = () => {  
        setTime(0); 
        setMinutes(0);
        setSeconds(0);
        setTenths(0);
        setInitial(true);
        setPlay(false);
        minutesRef.current.focus();
    };

    return (
        <div className='countdown'>
            {!initial &&
                <div className='time-bar'>
                    <div className='elapsed' style={{ height: (1 - time / startTime) * 100 + '%' }}></div>
                    <div className='remaining' style={{ height: time / startTime * 100 + '%' }}></div>
                </div>
            }
            <div className='input'>
                <input
                    ref={minutesRef} 
                    type='text'
                    value={showMinutes()} 
                    onChange={handleMinutes} 
                    disabled={play || !initial}
                />
                <span>:</span>
                <input 
                    type='text' 
                    value={showSeconds()} 
                    onChange={handleSeconds} 
                    disabled={play || !initial}
                />
                <span>.</span>
                <input 
                    type='text'
                    value={showTenths()} 
                    onChange={handleTenths} 
                    disabled={play || !initial}
                />
            </div>
            <div className='controls'>
                <button type='button' onClick={handlePlayPause}>{play ? 'Pause' : 'Play'}</button>
                <button type='button' onClick={handleReset} disabled={initial}>Reset</button>
            </div>
        </div>
    );
};

export default Countdown;