import React from 'react';
import TextField from 'material-ui/TextField';
import Button from '@material-ui/core/Button';
import RaisedButton from 'material-ui/RaisedButton';




class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                username: '',
                email: '',
                password: '',
            }
        };
    }

    onChange = e => {
        this.setState ({
            fields:{
                ...this.state.fields,
                [e.target.name]: e.target.value,
            }
        });
    };

    onSubmit = () => {
            console.log(this.state.fields);
    }


    render() {
        return (
            <form>
                <TextField
                    name='username'
                    hintText="Username"
                    floatingLabelText="Username"
                    value={this.state.fields.username}
                    onChange={ e => this.onChange(e)}
                    floatingLabelFixed />

                    <br/>

                    <TextField
                    name='email'
                    hintText="Email"
                    floatingLabelText="Email"
                    value={this.state.fields.email}
                    onChange={ e => this.onChange(e)}
                    floatingLabelFixed />

                    <br/>

                    <TextField
                    name='password'
                    hintText="Password"
                    floatingLabelText="Password"
                    value={this.state.fields.password}
                    onChange={ e => this.onChange(e)}
                    type="password"
                    floatingLabelFixed />
                    
                    <br/>
                    <RaisedButton label="Submit" 
                                onClick={() => this.onSubmit()} primary />
            </form>
        );
    }
}

export default Register;
