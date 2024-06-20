const splitTextByLineLength = (text: string, maxLineLength: number) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if (currentLine.length + word.length <= maxLineLength) {
            currentLine += word + ' ';
        } else {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        }
    });

    lines.push(currentLine.trim());
    return lines;
};

export default splitTextByLineLength