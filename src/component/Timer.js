import React, { Component } from "react";

class Timer extends Component {
  state = {
    setTime: 0,
    currTime: 0,
    maxTime: 359999000,
    sec: '00',
    min: '00',
    hour: '00',
    timerOn: false,
  };

  getFormattedTime = (unit, source = 'current') => {
    const time = source === 'current' ? this.state.currTime : source === 'set' ? this.state.setTime : 0;
    switch(unit) {
      case 'seconds':
        return ("0" + Math.floor((time / 1000) % 60)).slice(-2);        
      case 'minutes':
        return ("0" + Math.floor((time / 60000) % 60)).slice(-2);
      case 'hours':
        return ("0" + Math.floor(time / 3600000)).slice(-2);
      default:
        break;
    }
  }

  startTimer = () => {
    this.setState({
      timerOn: true
    });
    this.timer = setInterval(() => {
      const newTime = this.state.currTime - 100;
      if (newTime >= 0) {
        this.setState({
          currTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        alert("Countdown ended");
      }
    }, 100);
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ 
      timerOn: false,
      sec: this.getFormattedTime('seconds'),
      min: this.getFormattedTime('minutes'),
      hour: this.getFormattedTime('hours')
    });
  };

  resetTimer = () => {
    const { timerOn, currTime, setTime } = this.state
    if (!timerOn) {
      if (setTime === currTime) {
        this.setState({
          setTime: 0,
          currTime: 0,
          sec: '00',
          min: '00',
          hour: '00'
        });
      } else {
        this.setState({
          currTime: setTime,
          sec: this.getFormattedTime('seconds', 'set'),
          min: this.getFormattedTime('minutes', 'set'),
          hour: this.getFormattedTime('hours', 'set')
        })
      }
    }
  };
  
  updateTime = () => {
    console.log('Blur!')
    this.setState({
      sec: this.getFormattedTime('seconds'),
      min: this.getFormattedTime('minutes'),
      hour: this.getFormattedTime('hours')
    })
  }

  inputTime = (e, unit) => {
    const { currTime, maxTime } = this.state
    let addTime = e.target.value
    let newTime = 0;

    switch(unit) {
      case 'seconds':
        newTime = currTime - (currTime % 60000) + (addTime * 1000)
        this.setState({
          sec: addTime,
          currTime: Math.min(newTime, maxTime),
          setTime: Math.min(newTime, maxTime)
        })
        break;
      case 'minutes':
        newTime = currTime - (currTime % 3600000) + (currTime % 60000) + (addTime * 60000)
        this.setState({
          min: addTime,
          currTime: Math.min(newTime, maxTime),
          setTime: Math.min(newTime, maxTime)
        })
        break;
      case 'hours':
        if (addTime > 99) addTime = 99;
        newTime = (currTime % 3600000) + (addTime * 3600000)
        this.setState({          
          hour: addTime,
          currTime: newTime,
          setTime: newTime
        })
        break;
      default:
        break;
    }
  }

  addTime = (seconds) => {
    const { timerOn, currTime, setTime, maxTime } = this.state
    let adtlTime = seconds * 1000
    if (timerOn) {
      this.setState({
        setTime: Math.min((setTime + adtlTime), maxTime),
        currTime: Math.min((currTime + adtlTime), maxTime)
      })
    } else {
      let newTime = Math.min((currTime + adtlTime), maxTime);
      let newSeconds = ("0" + Math.floor((newTime / 1000) % 60)).slice(-2);
      let newMinutes = ("0" + Math.floor((newTime / 60000) % 60)).slice(-2);
      let newHours = ("0" + Math.floor(newTime / 3600000)).slice(-2);
      this.setState({
        setTime: Math.min((setTime + adtlTime), maxTime),
        currTime: Math.min((currTime + adtlTime), maxTime),
        sec: newSeconds,
        min: newMinutes,
        hour: newHours
      })
    }
  }

  render() {
    const { timerOn, currTime, setTime, sec, min, hour } = this.state;
    const resetActive = timerOn ? 'disable' : '';

    return (
      <div className='timer-wrapper'>
        {timerOn ? (
          <div className='clock'>
            <input className={` digits`} value={this.getFormattedTime('hours')} readOnly />{`:`}
            <input className={` digits`} value={this.getFormattedTime('minutes')} readOnly />{`:`}
            <input className={` digits`} value={this.getFormattedTime('seconds')} readOnly /> 
          </div>
        ) : (
          <div className='clock'>
            <input className={`digits`} type='number' maxLength='2' value={hour} onChange={(e) => {this.inputTime(e, 'hours')}} onBlur={this.updateTime} />{`:`}
            <input className={`digits`} type='number' maxLength='2' value={min} onChange={(e) => {this.inputTime(e, 'minutes')}} onBlur={this.updateTime} />{`:`}
            <input className={`digits`} type='number' maxLength='2' value={sec} onChange={(e) => {this.inputTime(e, 'seconds')}} onBlur={this.updateTime} />
          </div>
        )}
        <div className={'toggle'}>
          <button className={'circle-button'} onClick={() => {this.addTime(60)}}>+60</button>
          <button className={'circle-button'} onClick={() => {this.addTime(30)}}>+30</button>
        </div>
        {timerOn ? (
          <button className={'rect-button'} onClick={this.stopTimer}>Stop</button>
        ) : (
          <button className={'start rect-button'} onClick={this.startTimer}>Start</button>
        )}
        {currTime === setTime ? (
          <button className={`rect-button`} onClick={this.resetTimer}>Clear</button>  
        ) : (
          <button className={`${resetActive} rect-button`} onClick={this.resetTimer}>Reset</button>
        )}
      </div>
    );
  }
}

export default Timer;