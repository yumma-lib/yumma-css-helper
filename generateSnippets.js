// Yumma CSS Helper v0.0.1

const fs = require("fs");
const axios = require("axios");
const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");

const cssUrl = "https://unpkg.com/yummacss/dist/yumma.css";
let cachedCssContent = null;

async function fetchCssContent() {
    if (cachedCssContent) {
        return cachedCssContent;
    }

    try {
        const response = await axios.get(cssUrl);
        cachedCssContent = response.data;
        return cachedCssContent;
    } catch (error) {
        throw new Error(`Error fetching CSS from the CDN: ${error.message}`);
    }
}

module.exports = async function generateSnippets(snippetsFilePath) {
    try {
        const cssContent = await fetchCssContent();
        const result = await postcss().process(cssContent, { from: undefined });
        const root = result.root;
        const snippets = {};

        const classes = [];

        root.walkRules((rule) => {
            selectorParser((selectors) => {
                selectors.walkClasses((selector) => {
                    classes.push(selector.value);
                });
            }).processSync(rule.selector);
        });

        for (const className of classes) {
            let description = "No description available.";

            root.walkRules((rule) => {
                if (rule.selector.includes(`.${className}`)) {
                    const property = rule.nodes[0].prop;
                    description = `CSS property: ${property}`;
                }
            });

            snippets[className] = {
                prefix: className,
                body: [`${className}`],
                description,
                scope: "html",
            };
        }

        const snippetCount = Object.keys(snippets).length;

        fs.writeFileSync(snippetsFilePath, JSON.stringify(snippets, null, 2));
        return `You've imported ${snippetCount} snippets. (Please restart VS Code.)`;
    } catch (err) {
        return `Error: ${err.message}`;
    }
};
