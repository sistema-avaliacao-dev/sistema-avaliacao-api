export default function capitalizePhrase(phrase: string): string {
    const phraseFormated = phrase.replace(/\b\w+/g, (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return phraseFormated.toString()
}