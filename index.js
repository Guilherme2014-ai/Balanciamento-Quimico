// 1 Passo - Mapear todos os Nox.
// 2 Passo - Calcular todos os Nox.
// 3 Passo - Descobrir o agente Redutor e o Agente Oxidante.
// 4 Passo - Calcular o delta Nox de ambos.
// 5 Passo - Substituir os Delta nox e fazer o metodo de tentativas.

class ChemicalBalancing {

    constructor(unbalancedEquation){
        this.NoxList = {
            "I": -1,
            "Br": -1,
            "Cl": -1,
            "F": -1,

            "S": -2,
            "O": -2,

            "H": 1,
            "Li": 1,
            "Na": 1,
            "K": 1,
            "Rb": 1,
            "Cs": 1,
            "Fr": 1,
            "Ag": 1,

            "Be": 2,
            "Mg": 2,
            "Ca": 2,
            "Sr": 2,
            "Ba": 2,
            "Ra": 2,
            "Zn": 2,

            "Al": 3
        }
        this.reagents = unbalancedEquation.split("-->")[0].split("+");
        this.products = unbalancedEquation.split("-->")[1].split("+");
    }
    Handle() {
        const { reagentsAndThemNoxWithX, productsAndThemNoxWithNX } = this.CalcAtomsAndThemNox(); // Atribui todo os nox aos atomos de acordo com a tabela, caso nao esteja presente na tabela recebe "x".
        const { reagentsFormulaSolved, productsFormulaSolved } = this.NoxSolveds(reagentsAndThemNoxWithX,productsAndThemNoxWithNX); // Calcula os nox com "x", nox nao resolvidos, devolve um array com todos os valores calculados.
        const { reagentsAndThemNoxWithXComplete, productsAndThemNoxWithNXComplete } = this.insertMissingNox(reagentsAndThemNoxWithX,productsAndThemNoxWithNX,reagentsFormulaSolved,productsFormulaSolved); // substituir os "x" pelo valor.

        // console.log(this.reagents,this.products);
        // this.showResults(reagentsFormulaSolved,productsFormulaSolved,reagentsAndThemNoxWithXComplete,productsAndThemNoxWithNXComplete);

        console.log("Calma !");
    }
    
    CalcAtomsAndThemNox() {
        const reagentsAndThemNoxWithX = {}, productsAndThemNoxWithNX = {}; // Syntax Expected: { C: 0, H: 1, N: 'x', O: -2 }
        // this.reagents: [ 'C', 'HNO3' ] separado por "+"

        /* OBS
        quando o atomo se repete dentro do mesmo reagente/produto, e feito um array para armazenar os valores
        conforme o planejado, oque resta e adpetar o resto do script para tal mudanca.\

        - atualizar a func. q encaixa os Valores no X
        */

        this.reagents.forEach(elem => {
            const eachAtom = elem.split("");

            for(let i=0;i<eachAtom.length;i++){
                const currentValue = eachAtom[i], nextValue = eachAtom[i+1];

                if(this.isUpperCase(currentValue) && !this.isThisAtomANumber(currentValue)) {
                    const atom = nextValue && !this.isUpperCase(nextValue) && !this.isThisAtomANumber(nextValue) ? `${currentValue}${nextValue}` : `${currentValue}`;
                    const atomNox = this.getNox(elem,atom);

                    if(reagentsAndThemNoxWithX[`${atom}`]) {
                        if(typeof reagentsAndThemNoxWithX[`${atom}`] == "object") {
                            reagentsAndThemNoxWithX[`${atom}`].push(atomNox);
                        } else {
                            const oldNox = reagentsAndThemNoxWithX[`${atom}`];

                            reagentsAndThemNoxWithX[`${atom}`] = [];

                            reagentsAndThemNoxWithX[`${atom}`].push(oldNox);
                            reagentsAndThemNoxWithX[`${atom}`].push(atomNox);
                        }
                    } else {
                        reagentsAndThemNoxWithX[`${atom}`] = atomNox;
                    }
                }else{}
            }
        })
        this.products.forEach(elem => {
            const eachAtom = elem.split("");

            for(let i=0;i<eachAtom.length;i++){
                const currentValue = eachAtom[i];
                const nextValue = eachAtom[i+1];

                if(this.isUpperCase(currentValue) && !this.isThisAtomANumber(currentValue)) {
                    const atom = nextValue && !this.isUpperCase(nextValue) && !this.isThisAtomANumber(nextValue) ? `${currentValue}${nextValue}` : `${currentValue}`;
                    const atomNox = this.getNox(elem,atom);

                    if(productsAndThemNoxWithNX[`${atom}`]) {
                        const oldNox = productsAndThemNoxWithNX[`${atom}`];

                        if(typeof oldNox == "object") {
                            productsAndThemNoxWithNX[`${atom}`].push(atomNox);
                        } else {
                            productsAndThemNoxWithNX[`${atom}`] = [];

                            productsAndThemNoxWithNX[`${atom}`].push(oldNox);
                            productsAndThemNoxWithNX[`${atom}`].push(atomNox);
                        }
                    } else {
                        productsAndThemNoxWithNX[`${atom}`] = atomNox;
                    }
                }
            }
        })

        const reagentsAndThemNoxWithX_zeroBugSolved = this.ArrayToJson(Object.entries(reagentsAndThemNoxWithX).map(e => {
            if(typeof e[1] == "object") {
                e[1] = e[1].map(b => Number(b))
                return e;
            } else {
                return e;
            }
        }));
        const productsAndThemNoxWithNX_zeroBugSolved = this.ArrayToJson(Object.entries(productsAndThemNoxWithNX).map(e => {
            if(typeof e[1] == "object") {
                e[1] = e[1].map(b => Number(b))
                return e;
            } else {
                return e;
            }
        }));
        
        return {
            reagentsAndThemNoxWithX: reagentsAndThemNoxWithX_zeroBugSolved,
            productsAndThemNoxWithNX: productsAndThemNoxWithNX_zeroBugSolved
        };
    }
    NoxSolveds(reagentsNox, productsNox) { // parametros recebidos de "CalcAtomsAndThemNox()" // HERE
        /*Contexto
        Esta funcao monta a formula e devolve os nox resolvidos

        Ja foi feito a alteracao dos nox em formato de array se necessario, e o metodo de localizacao do index de cada atom,
        se nao fosse feito como saberia qual o nox pertencente a tal atom dentro do array ne ?

        Oque precisa ser feito agr e calcular os nox"X" com os recursos acima.
        */

        const reagents = [ ...this.reagents ];
        const products = [ ...this.products ];

        const reagentsFormula = this.buildTheFormula(reagents,reagentsNox);
        const productsFormula = this.buildTheFormula(products,productsNox);

        const reagentsFormulaSolved = reagentsFormula.map(formula => this.SolveSimpleEquations(formula)).filter(val => val != null);
        const productsFormulaSolved = productsFormula.map(formula => this.SolveSimpleEquations(formula)).filter(val => val != null);

        return { reagentsFormulaSolved,productsFormulaSolved };
    }
    SolveSimpleEquations(equation) {
        equation = equation.split("=")[0];
        if(equation.includes("x")) {
            const operators = equation.split("").filter(caracter => caracter == "-" || caracter == "+");
            const eachEquationNum = equation.split(/\+|\-/).filter(e=>e!="");

            const equationNumbers = [];
            let numberFolledByX = 1;
            
            for(let i=0;i<eachEquationNum.length;i++) {
                const operatorAndHisNumSTRING = `${operators[i]}${eachEquationNum[i]}`;
    
                if(operatorAndHisNumSTRING.includes("x")) {
                    operatorAndHisNumSTRING.split("").forEach(caracter => {
                        if(this.isThisAtomANumber(caracter)) numberFolledByX = Number(caracter); // no caso nao e um atom, porem vou usar assim mesmo. 
                    });
                } else {
                    const operatorAndHisNumNUMBER = Number(operatorAndHisNumSTRING);
                    equationNumbers.push(operatorAndHisNumNUMBER);
                }
            }
            return ((equationNumbers.reduce((accumulated, currentValue) => accumulated + currentValue)/numberFolledByX)*(-1));
        }

        return null;
        // precisa ser chamado primeiro.
    }

    
    isThisAtomANumber(atom) {
        return !isNaN(Number(atom)+Number(atom));
    }
    isUpperCase(caracter) {
        return caracter.replace(/[A-Z]/,"_isUpper_") == caracter ? false : true;
    }
    insertMissingNox(reagents,products,missingNoxReag,missingNoxProd) {
        reagents = Object.entries(reagents);
        products = Object.entries(products);

        let i,j;
        let n = 0, k = 0;

        for(i=0;i<reagents.length;i++) {
            const atomAndHisNoxArr = reagents[i];
            const [ atom, nox ] = atomAndHisNoxArr;

            if(nox == "x") {
                reagents[i][1] = missingNoxReag[n];
                n++
            }
        }
        for(j=0;j<products.length;j++) {
            const atomAndHisNoxArr = products[j];
            const [ atom, nox ] = atomAndHisNoxArr;

            if(nox == "x") {
                products[j][1] = missingNoxProd[k];
                k++
            }
        }

        const reagentsAndThemNoxComplete = this.ArrayToJson(reagents);
        const productsAndThemNoxComplete = this.ArrayToJson(products);

        return { reagentsAndThemNoxComplete,productsAndThemNoxComplete };
    }
    ArrayToJson(array) {
        const obj = {};

        array.forEach(jsonArr => {
            let [ key, value ] = jsonArr;
            obj[`${key}`] = value;
        });

        return obj;
    }
    showResults(reagentsAndThemNox,productsAndThemNox,reagentsAndThemNoxComplete,productsAndThemNoxComplete) {
        console.log();
        console.log("-------------------------------------------------------------");
        console.log();
        console.log(reagentsAndThemNox,productsAndThemNox);
        console.log(reagentsAndThemNoxComplete,productsAndThemNoxComplete);
        console.log();
        console.log("-------------------------------------------------------------");
        console.log();
    }
    getNox(elem,atom) {
        const zero = "0";
        if(elem.length == atom.length) return zero; // a key sendo 0 o js reconhece como invalido/null...
        if(!this.NoxList[`${atom}`]) return "x";
        return this.NoxList[`${atom}`];
    }
    getAtomIndex(group,elem,elemIndex,atom) { // Group --> Reagente / Produto.
        let index = -1;
        let finalIndex = -1;

        // Contexto
        /*Nao terminado, resultados nao condizentes. O resultado aqui sera usado na funcao "NoxSolveds()"*/
        /*
            Como ?:
            o atom que tem repeticao ira apontar para uma Key com uma value do tipo array, a posicao do real nox do atom
            em questao sera o index, engenhoso ne, obrigado kk, calma... eu estou falando sozinho? aff... esse projeto
            nao esta me fazendo bem ;D
        */

        group.forEach(_elem => {
            const eachAtom = _elem.split("");
            
            if(_elem == elem){
                for(let i=0;i<=elemIndex;i++) {
                    const currentValue = eachAtom[i];
                    const nextValue = eachAtom[i+1];
    
                    if(this.isUpperCase(currentValue) && this.isThisAtomANumber(currentValue) === false) {
                        if(nextValue && !this.isUpperCase(nextValue) && !this.isThisAtomANumber(nextValue)) {
                            const _atom = `${currentValue}${nextValue}`;
                            if(_atom === atom) {
                                index++;
                                finalIndex = index;
                            };
                        } else {
                            const _atom = `${currentValue}`;
                            if(_atom === atom) {
                                index++;
                                finalIndex = index;
                            };
                        }
                    }
                }
            } else {
                for(let i=0;i<eachAtom.length;i++) {
                    const currentValue = eachAtom[i];
                    const nextValue = eachAtom[i+1];
    
                    if(this.isUpperCase(currentValue) && this.isThisAtomANumber(currentValue) === false) {
                        if(nextValue && !this.isUpperCase(nextValue) && !this.isThisAtomANumber(nextValue)) {
                            const _atom = `${currentValue}${nextValue}`;
                            if(_atom === atom) index++;
                        } else {
                            const _atom = `${currentValue}`;
                            if(_atom === atom) index++;
                        }
                    }
                }
            }
        });

        return finalIndex;
    }
    buildTheFormula(group,groupNox) {
        return group.map(elem => {
            const atoms = elem.split("");
            let formula = [];

            for(let i=0;i<atoms.length;i++) {
                const currentValue = atoms[i], nextValue = atoms[i+1];

                if(this.isUpperCase(currentValue) && !this.isThisAtomANumber(currentValue)) {
                    const atom = nextValue && !this.isUpperCase(nextValue) && !this.isThisAtomANumber(nextValue) ? `${currentValue}${nextValue}` : `${currentValue}`;
                    const noxAtom = groupNox[`${atom}`];

                    if(typeof noxAtom == "object") {
                        const atomIndex = this.getAtomIndex(group,elem,i,atom);
                        if(this.isThisAtomANumber(nextValue)) {
                            if(noxAtom[atomIndex] == "x") {
                                formula.push(`${nextValue}x`);
                            } else formula.push(`${noxAtom[atomIndex]*nextValue}`);
                                                 
                        } else formula.push(`${noxAtom[atomIndex]}`);
                    } else {
                        if(this.isThisAtomANumber(nextValue)) {
                            if(noxAtom == "x") {
                                formula.push(`${nextValue}x`);
                            } else formula.push(`${noxAtom*nextValue}`);
                                                 
                        } else formula.push(`${noxAtom}`);
                    }
                };
            }

            return formula;
        }).map(noxValues => {
            const newnoxValues = noxValues.map(currentValue => {
                const operation = currentValue.split("")[0] == "+" || currentValue.split("")[0] == "-";

                return !operation ? `+${currentValue}` : currentValue;
            });
            return newnoxValues;
        }).map(formula => `${formula.join("")}=0`); // mais para frente fazer atualizacao para o suporte de ion na formula
    }
}

const firstQuestion = new ChemicalBalancing("C+HNO3-->CO2+NO2+H2O");
firstQuestion.Handle();

// Syntax Ex.: C+HNO3-->CO2+NO2+H2O
// NaClO3+H2SO4-->HClO4+ClO2+Na2SO4+H2O

/*
Contexto:

Vai ser feito primeiro um script sem a opcao de fazer balanceamento com 2 atomos iguai no mesmo produto/reagente, depois que o script
for testado, sera feito um update para o novo com esta opcao inclusa.

    Anotacoes sobre:
        Erros:
            1 - Selecao de elemenros com mais de duas letras --> ✔.
            2 - Dois elementos no mesmo Reagente/Produto --> ...
            3 - "X" maior que 1. --> X
            4 - nox dependentes de outros atomos. --> X
*/
