const { Fragment, Component } = wp.element;
import React from 'react';

import './editor.scss';

export default class SimpleInput extends Component {
    constructor( props ) {
        super( props );
        this.fakeInput = React.createRef();
    }

    componentDidMount() {
        window.addEventListener( 'load', this.update );
    }

    componentWillUnMount() {
        window.removeEventListener( 'load', this.update );
    }

    update = () => this.forceUpdate();

    onChange = ( event ) => {
        const eventValue = event.target.value;
        this.props.onChange( eventValue );
    };

    calculateWidth = ( value ) => {
        if ( this.fakeInput.current ) {
            this.fakeInput.current.innerText = value;
            return this.fakeInput.current.offsetWidth + 1;
        }
        this.update();
    };

    render() {
        const {
            value, placeholder, fontSize, className = '',
        } = this.props;

        return (
            <Fragment>
                <div className="input-buffer" ref={ this.fakeInput } />
                <input
                    value={ value }
                    onChange={ this.onChange }
                    placeholder={ placeholder }
                    className={ `simpleInput ${ className }` }
                    style={ {
                        fontWeight: 'inherit',
                        fontSize: `${ fontSize }px`,
                        background: 'transparent',
                        border: '0',
                        width: `${ this.calculateWidth( value ) }px`,
                        color: 'inherit',
                        padding: '0',
                        margin: '0',
                    } }
                />
            </Fragment>
        );
    }
}
