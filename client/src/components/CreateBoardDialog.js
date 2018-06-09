import React from 'react';

class CreateBoardDialog extends React.Component {
    state = {
        name: '',
    }

    render(){
        return(
            <Dialog
                title ="Dialog with Actions"
                actions = {action}
                model ={false}
                open= {this.props.open}
                onRequestClose ={this.handleClose} >
            
            </Dialog>
        );
    }
}