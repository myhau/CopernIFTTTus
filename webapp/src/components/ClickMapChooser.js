import React from 'react';
import Select from 'react-select';
import 'whatwg-fetch'

let clickOptions = [
  {value: 1, label: "Single click"},
  {value: 2, label: "Double click"},
  {value: 3, label: "Triple click"}
];

let channelOptions = [
  {value: 1, label: "1st channel"},
  {value: 2, label: "2nd channel"},
  {value: 3, label: "3rd channel"},
  {value: 4, label: "4th channel"}
];


class OneChooser extends React.Component {


  constructor(props) {
    super(props);
  }

  clickChange = val => {
    let newState = Object.assign({}, this.props.what, {click: val})
    this.props.onChange(newState)
  }

  channelChange = val => {
    let newState = Object.assign({}, this.props.what, {channel: val})
    this.props.onChange(newState)
  }

  eventNameChange = ev => {
    let newState = Object.assign({}, this.props.what, {eventName: ev.target.value})
    this.props.onChange(newState)
  }

  customDataChange = ev => {
    let newState = Object.assign({}, this.props.what, {customData: ev.target.value})
    this.props.onChange(newState)
  }

  render() {
    let margin = "10px";
    let widthEach = "140px";
    let fontSize = "16px"
    return (
      <div>
        <Select
          style={{float:"left", width:widthEach, marginRight: margin}}
          name="click-option"
          value={this.props.what.click}
          options={clickOptions}
          onChange={vl => this.clickChange(vl)}/>
        <Select
          name="channel-change"
          style={{float:"left", width:widthEach, marginRight: margin}}
          value={this.props.what.channel}
          options={channelOptions}
          onChange={vl => this.channelChange(vl)}/>
        <input
          className="Select-control" placeholder="Event name" name="event"
          value={this.props.what.eventName}
          style={{float:"left", fontSize:fontSize, width:widthEach, marginRight: margin}}
          onChange={vl => this.eventNameChange(vl)}
        />
        <input
          className="Select-control" placeholder="Custom data" name="custom-data"
          value={this.props.what.customData}
          style={{float:"left", fontSize:fontSize, width:widthEach, marginRight: margin}}
          onChange={vl => this.customDataChange(vl)}
        />
        {(() => {
          if (this.props.showRemove) {
            return <input style={{float:"left", width:"100px", marginRight: margin, fontSize: fontSize}}
                          value="Remove" type="button" className="Select-control"
                          onClick={this.props.onRemove}/>
          }
        })()}
        {(() => {
          if (this.props.showAdd) {
            return <input style={{float:"left", width:"100px", marginRight: margin, fontSize: fontSize}}
                          value="Add..." type="button" className="Select-control"
                          onClick={this.props.onAddNew}/>
          }
        })()}


      </div>
    )
  }
}

OneChooser.propTypes = {
  what: React.PropTypes.object,
  showAdd: React.PropTypes.bool,
  showRemove: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onAddNew: React.PropTypes.func,
  onRemove: React.PropTypes.func
};

export default class ClickMapChooser extends React.Component {

  constructor(props) {
    super(props);
    this.lastTimeout = null;
    this.state = {
      bindings: [{click: 1, channel: 1, eventName: undefined, customData: undefined}],
      valid: true,
      sent: false
    }
    this.state.valid = this.isStateValid(this.state)
  }

  isStateValid = (st) => {
    let validNotEmpty = st.bindings.map((obj) => {
      return Object.keys(obj).map(k => obj[k]).every(x => x != null && x != undefined && x !== "")
    }).every(x => x)

    let validNotDuplicate = st.bindings.map((obj) => obj.click + "|" + obj.channel)
    for(let i = 0; validNotDuplicate.length > i; i++) {
      for(let j = i + 1; validNotDuplicate.length > j; j++) {
        if(validNotDuplicate[i] == validNotDuplicate[j]) return false;
      }
    }
    return validNotEmpty
  }


  onChangeOne = (i, val) => {
    let newState = Object.assign({}, this.state);
    newState.bindings[i] = val
    newState.valid = this.isStateValid(newState)

    this.setState(newState)
  }

  addNew = () => {
    let newState = Object.assign({}, this.state);
    newState.bindings.push({click: 1, channel: 1, eventName: undefined, customData: undefined});
    newState.valid = this.isStateValid(newState)
    this.setState(newState);
  }

  removeOne = (i) => {
    let newState = Object.assign({}, this.state);
    newState.bindings.splice(i, 1);
    newState.valid = this.isStateValid(newState)
    this.setState(newState);
  }

  submit = () => {
    if (!this.state.valid) return
    this.setState(Object.assign({}, this.state, {sent: true, valid: true}));
    setTimeout(() => this.setState(Object.assign({}, this.state, {sent: false})), 5000)
    let request = {
      bindings: this.state.bindings,
      key: "{{key}}"
    };

    let postConfigFun = () => {
      console.log("trying to resend");
      fetch('http://localhost:8091/api/config', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          request
        )
      }).then(() => console.log("sent"), (err) => console.log("err" + err));
    };

    if(this.lastTimeout != null)
      clearTimeout(this.lastTimeout)

    this.lastTimeout = setTimeout(postConfigFun, 10 * 1000)

    postConfigFun()

    console.log("Submitted data " + request)
  };

  render() {
    console.log(this.state)
    let all = this.state.bindings.length;
    let margin = "10px";
    let widthEach = "140px";
    let fontSize = "16px"
    return (
      <div style={{marginLeft: "auto", marginRight:"auto", width:"850px", marginTop: "30px"}}>
        {this.state.bindings.map((binding, i) => (
          <div key={i} style={{clear:"both"}}>
            <OneChooser onAddNew={this.addNew} onRemove={() => this.removeOne(i)} onChange={val => this.onChangeOne(i, val)}
                        showRemove={all > 1} showAdd={i == all - 1} what={binding}/>
          </div>
        ))}
        <div style={{width: "210px", margin:"auto"}}>
          <input
              style={{float:"left", width:"200px", margin: "auto", fontSize: fontSize, marginTop: "50px", marginBottom: "20px"}}
            value="Send" type="button" className="Select-control"
            onClick={() => this.submit()}/>

          {(() => {
            if (!this.state.valid) {
              return <div style={{textAlign: "center", width: "210px", color:"red"}}>Invalid data</div>
            }
            if (this.state.sent) {
              return <div style={{textAlign: "center", width: "210px", color:"green"}}>Bindings submitted</div>
            }
          })()}
        </div>

      </div>)
  }
}

ClickMapChooser.propTypes = {};

export default ClickMapChooser;
