/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order/error"],
  ignoreFiles: ["dist/**", ".astro/**", ".agents/**"],
  rules: {
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "color-hex-length": null,
    "value-keyword-case": null,
    "media-feature-range-notation": null,
    "import-notation": "string",
    "selector-class-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
    "custom-property-pattern": "^_?[a-z][a-z0-9]*(-[a-z0-9]+)*$",
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global", "local", "target-current"] },
    ],
    "property-no-unknown": [true, { ignoreProperties: ["composes"] }],
  },
};
