export default function FormulaProcessor(expression) {
    let col1 = "";
    let col2 = "";
    if (expression.match(/^=sum\((.\w*?),(.\w*?)\)$/g)) {
        console.log(expression.match(/^=sum\((.\w*?),(.\w*?)\)$/g));
        const RegCode = /^=sum\((?<col1>.\w*?),(?<col2>.\w*?)\)$/g;
        const exp = RegCode.exec(expression);
        const parameter1 = exp.groups.col1;
        const parameter2 = exp.groups.col2;
        if (parameter1.match(/^(c\d*?)$/i)) {
            const RegCode1 = /^c(?<column>\d*?)$/g;
            const exper1 = RegCode1.exec(parameter1);
            col1 = exper1.groups.column;
        }
        if (parameter2.match(/^(c\d*?)$/i)) {
            const RegCode2 = /^c(?<column>\d*?)$/g;
            const exper2 = RegCode2.exec(parameter2);
            col2 = exper2.groups.column;
        }
    }
    if (col1.length > 0 && col2.length > 0) {
        return [Number(col1), Number(col2)];
    } else return [];
}
