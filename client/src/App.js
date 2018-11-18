import React, { Component } from 'react';
import logo from './logo.svg';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/c_cpp';
import 'brace/theme/github';
import 'brace/ext/language_tools';
class App extends Component {
  constructor() {
    super()
    const helloworldCPP = `
    #include <iostream>
    using namespace std;

    int main() {
        cout << "Hello World " << endl;
        cerr << "Hello Dark Side " << endl;
    }
    `
    this.state = {
      value: helloworldCPP
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.result !== nextState.result
  }
  onChange = (newValue) => {
    this.setState({value: newValue})
  }
  submit = () => {
    const serverUrl = "http://localhost:3000"
    fetch(`${serverUrl}/run`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({code: this.state.value})
    }).then(res => {
      console.log(res)
      return res.json()
    })
    .then(content => {
      console.log(content)
      this.setState({result: content})
    }
    )
  }
  render() {
    return (
      <div>
        <AceEditor
          mode="c_cpp"
          theme="github"
          onChange={this.onChange}
          name="UNIQUE_ID_OF_DIV"
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          editorProps={{ $blockScrolling: true }}
          value={this.state.value}
          height={'300px'}
        />
        <input type="button"
        style= {{height:'40px', fontSize:'30px'}}
        value="run" onClick={this.submit}></input>
        <textarea style={{height:'80px', width:'200px'}} value={JSON.stringify(this.state.result)}>
        </textarea>
      </div>
    )
  }
}

export default App;


