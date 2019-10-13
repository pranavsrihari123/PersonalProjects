import React from 'react';
import ReactDOM from 'react-dom';


class LikeButton extends React.Component {
	
	const e = React.createElement;
	
  constructor() {
    super();
    this.state = {
      liked: false
    };
    this.handleClick = this.handleClick.bind(this);
  } 
  
  handleClick() {
    this.setState({
      liked: !this.state.liked
    });
  }
  
  render() {
    const text = this.state.liked ? 'liked' : 'haven\'t liked';
    const label = this.state.liked ? 'Unlike' : 'Like'
    return (
		e('div', {className: "customContainter"}, [e('button', {className: "btn", onClick={this.handleClick})}}, "label"), e('p', null, `you ${text} this`)]);
    );
  }
}

ReactDOM.render(
	e(LikeButton, null, null),
  document.getElementById('like_button_container')
);