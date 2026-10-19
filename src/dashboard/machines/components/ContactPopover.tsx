"use client";

import { useState } from "react";
import styles from "./ContactPopover.module.css";

export function ContactPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.iconButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Contact information"
        aria-expanded={isOpen}
      >
        ?
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label="Contact information">
          <div className={styles.arrow} aria-hidden="true" />
          <div className={styles.content}>
            <h3>Need Help?</h3>
            <p>
              <a href="mailto:gabriadze.nika@kiu.edu.ge">
                gabriadze.nika@kiu.edu.ge
              </a>
              <span className={styles.name}>Nika Gabriadze</span>
            </p>
            <p className={styles.subtitle}>
              Feel free to reach out for any questions or issues
            </p>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </div>
  );
}

