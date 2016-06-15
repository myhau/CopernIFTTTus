import React from 'react';
import Select from 'react-select';

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
          if (this.props.showAdd) {
            return <input style={{float:"left", width:"100px", marginRight: margin, fontSize: fontSize}}
                          value="Add..." type="button" className="Select-control"
                          onClick={() => this.props.onAddNew()}/>
          }
        })()}
      </div>
    )
  }
}

OneChooser.propTypes = {
  what: React.PropTypes.object,
  showAdd: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  onAddNew: React.PropTypes.func
};

class ClickMapChooser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bindings: [{click: 1, channel: 1, eventName: undefined, customData: undefined}],
      valid: true,
      sent: false
    }
    this.state.valid = this.isStateValid(this.state)
  }

  isStateValid = (st) => (
    st.bindings.map((obj) => {
      return Object.keys(obj).map(k => obj[k]).every(x => x != null && x != undefined && x !== "")
    }).every(x => x)
  )

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

  submit = () => {
    if (!this.state.valid) return
    this.setState(Object.assign({}, this.state, {sent: true, valid: true}));
    setTimeout(() => this.setState(Object.assign({}, this.state, {sent: false})), 5000)
    let request = {
      bindings: this.state.bindings,
      key: "{{key}}"
    }
    console.log("Submitted data " + request)
  }

  render() {
    console.log(this.state)
    let all = this.state.bindings.length;
    let margin = "10px";
    let widthEach = "140px";
    let fontSize = "16px"
    return (
      <div style={{marginLeft: "auto", marginRight:"auto", width:"800px"}}>
        {this.state.bindings.map((binding, i) => (
          <div key={i} style={{clear:"both"}}>
            <OneChooser onAddNew={this.addNew} onChange={val => this.onChangeOne(i, val)}
                        showAdd={i == all - 1} what={binding}/>
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
