import { Link } from "react-router-dom";

import styles from './Button.module.scss';

function Button({ to, href, text=false, onClick, children, disabled=false, outline=false, className, ...passProps }) {

    let Comp = 'button';
    const props = {
        onClick,
        ...passProps
    }

    if(disabled) {
        Object.keys(props).forEach((key) => {
            if(key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        })
    }

    if(to) {
        props.to = to;
        Comp = Link;
    } else if(href) {
        props.href = href;
        Comp = 'a';
    }

    const classes = [
        styles.wrapper,
        className,
        text && styles.text,
        disabled && styles.disabled,
        outline && styles.outline
    ]
    .filter(Boolean)
    .join(' ');

    return ( 
        <Comp className={classes} {...props}>
            {children}
        </Comp>
    );
}

export default Button;