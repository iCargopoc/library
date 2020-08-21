export default function FormulaProcessor(expression) {
    let columnArray = [];
    if (expression.match(/^=sum\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/g)) {
        console.log(
            expression.match(/^=sum\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$/g)
        );
        const RegCode = /^=sum\((?<one>.\w*?),(?<more>(.\w*?)*?)\)$$/g;
        const exp = RegCode.exec(expression);
        const parameter1 = exp.groups.one;
        const parameter2 = exp.groups.more;
        if (parameter1.match(/^(c\d*?)$/i)) {
            const RegCode1 = /^c(?<column>\d*?)$/g;
            const exper1 = RegCode1.exec(parameter1);
            columnArray.push(Number(exper1.groups.column));
        }
        if (parameter2.length > 1) {
            const moreParameters = parameter2.split(",");
            moreParameters.forEach((item) => {
                if (item.match(/^(c\d*?)$/i)) {
                    const RegCodes = /^c(?<column>\d*?)$/g;
                    const expers = RegCodes.exec(item);
                    columnArray.push(Number(expers.groups.column));
                }
            });
        } else {
            if (parameter2.match(/^(c\d*?)$/i)) {
                const RegCode2 = /^c(?<column>\d*?)$/g;
                const exper2 = RegCode2.exec(parameter2);
                columnArray.push(Number(exper2.groups.column));
            }
        }
    }

    if (columnArray.length > 1) {
        console.log(columnArray);
        return columnArray;
    } else return [];
}
