import React, { useRef } from "react";
import styles from "./ErrorMessage.module.css";
import { CSSTransition } from "react-transition-group";

const ErrorMessage: React.FC<{ text?: string; className?: string }> = ({ text, className }) => {
  const transitionRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={transitionRef}
      in={!!text}
      timeout={600}
      classNames={{
        enter: styles["collapse-enter"],
        enterActive: styles["collapse-enter-active"],
        exit: styles["collapse-exit"],
        exitActive: styles["collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      {text ? (
        <div ref={transitionRef} className={`${styles["wrapper"]} ${className || ""}`} >
          <span className={`${styles["text-error"]}`}>{text}</span>
        </div>
      ) : (
        <></>
      )}
    </CSSTransition>
  );
};

export default ErrorMessage;
