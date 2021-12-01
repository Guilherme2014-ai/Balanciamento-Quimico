// 1 Passo - Mapear todos os Nox.
// 2 Passo - Calcular todos os Nox.
// 3 Passo - Descobrir o agente Redutor e o Agente Oxidante.
// 4 Passo - Calcular o delta Nox de ambos.
// 5 Passo - Substituir os Delta nox e fazer o metodo de tentativas.

/*
Nox dos Reagentes e Produtos ja Atribuidos, so falta calculalos.
- ja calculados, necessita de conexao com os respectivos atomos.

next step: fazer uma funcao que calcula o nox do atomo com X.
*/

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
        //console.log(this.reagents);
        //console.log(this.products);
        const { reagentsAndThemNox, productsAndThemNox } = this.CalcAtomsAndThemNox(); // Atribui todo os nox aos atomos de acordo com a tabela, caso nao esteja presente na tabela recebe "x".
        const { reagentsEquationSolved, productsEquationSolved } = this.NoxSolveds(reagentsAndThemNox,productsAndThemNox); // Calculla os nox com "x", nox nao resolvidos, devolve um array com todos os valores calculados.
        const { reagentsAndThemNoxComplete, productsAndThemNoxComplete } = this.insertMissingNox(reagentsAndThemNox,productsAndThemNox,reagentsEquationSolved,productsEquationSolved);
        // substituir os "x" pelo valor.
        
        console.log(reagentsAndThemNox,productsAndThemNox);
        console.log();
        console.log(reagentsAndThemNoxComplete,productsAndThemNoxComplete);
        
    }
    
    CalcAtomsAndThemNox() {
        const reagentsAndThemNox = {}, productsAndThemNox= {};

        // Necessita Reviso ! (Explicacao na ultima linha.)
        this.reagents.forEach(elem => {
            const separetedAtoms = elem.split("");

            if(separetedAtoms.length == 1) {
                if(reagentsAndThemNox[`${separetedAtoms[0]}`] && reagentsAndThemNox[`${separetedAtoms[0]}`] != 0) {
                    if(typeof reagentsAndThemNox[`${separetedAtoms[0]}`] == "number") {
                        reagentsAndThemNox[`${separetedAtoms[0]}`].push(0);
                    }else {
                        const oldValue = reagentsAndThemNox[`${separetedAtoms[0]}`];
                        reagentsAndThemNox[`${separetedAtoms[0]}`] = [];

                        reagentsAndThemNox[`${separetedAtoms[0]}`].push(oldValue);
                        reagentsAndThemNox[`${separetedAtoms[0]}`].push(0);
                    }
                } else {
                    reagentsAndThemNox[`${separetedAtoms[0]}`] = 0;
                }
            } else {
                for(let i=0;i<separetedAtoms.length;i++) {
                    let atom = separetedAtoms[i];
                    const nextAtom = separetedAtoms[i+1];

                    if(!this.isThisAtomANumber(atom)) {
                        if(this.isUpperCase(atom)) {
                            if(nextAtom) {
                                if(!this.isUpperCase(nextAtom) && !this.isThisAtomANumber(nextAtom)) atom = `${atom}${nextAtom}`;
                                const atomNox = this.NoxList[`${atom}`];
    
                                if(atomNox) {
                                    if(reagentsAndThemNox[`${atom}`] && reagentsAndThemNox[`${atom}`] != atomNox) {
                                        if(typeof reagentsAndThemNox[`${atom}` == "object"]) {
                                            reagentsAndThemNox[`${atom}`].push(atomNox);
                                        } else {
                                            const oldValue = reagentsAndThemNox;
        
                                            reagentsAndThemNox[`${atom}`] = [];
        
                                            reagentsAndThemNox[`${atom}`].push(oldValue);
                                            reagentsAndThemNox[`${atom}`].push(atomNox);
                                        }
                                    } else {
                                        reagentsAndThemNox[`${atom}`] = atomNox
                                    }
                                } else {
                                    if(reagentsAndThemNox[`${atom}`] && reagentsAndThemNox[`${atom}`] != "x") {
                                        if(typeof reagentsAndThemNox[`${atom}` == "object"]) {
                                            reagentsAndThemNox[`${atom}`].push("x");
                                        } else {
                                            const oldValue = reagentsAndThemNox;
        
                                            reagentsAndThemNox[`${atom}`] = [];
        
                                            reagentsAndThemNox[`${atom}`].push(oldValue);
                                            reagentsAndThemNox[`${atom}`].push("x");
                                        }
                                    } else {
                                        reagentsAndThemNox[`${atom}`] = "x";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        this.products.forEach(elem => { 
            const separetedAtoms = elem.split("");

            if(separetedAtoms.length == 1) {
                if(productsAndThemNox[`${separetedAtoms[0]}`] && productsAndThemNox[`${separetedAtoms[0]}`] != 0) {
                    if(typeof productsAndThemNox[`${separetedAtoms[0]}`] == "number") {
                        productsAndThemNox[`${separetedAtoms[0]}`].push(0);
                    }else {
                        const oldValue = productsAndThemNox[`${separetedAtoms[0]}`];
                        productsAndThemNox[`${separetedAtoms[0]}`] = [];

                        productsAndThemNox[`${separetedAtoms[0]}`].push(oldValue);
                        productsAndThemNox[`${separetedAtoms[0]}`].push(0);
                    }
                } else {
                    productsAndThemNox[`${separetedAtoms[0]}`] = 0;
                }
            } else {
                for(let i=0;i<separetedAtoms.length;i++) {
                    let atom = separetedAtoms[i];
                    const nextAtom = separetedAtoms[i+1];

                    if(!this.isThisAtomANumber(atom)) {
                        if(this.isUpperCase(atom)) {
                            if(nextAtom) {
                                if(!this.isUpperCase(nextAtom) && !this.isThisAtomANumber(nextAtom)) atom = `${atom}${nextAtom}`;
                                const atomNox = this.NoxList[`${atom}`];
    
                                if(atomNox) {
                                    if(productsAndThemNox[`${atom}`] && productsAndThemNox[`${atom}`] != atomNox) {
                                        if(typeof productsAndThemNox[`${atom}` == "object"]) {
                                            productsAndThemNox[`${atom}`].push(atomNox);
                                        } else {
                                            const oldValue = productsAndThemNox;
        
                                            productsAndThemNox[`${atom}`] = [];
        
                                            productsAndThemNox[`${atom}`].push(oldValue);
                                            productsAndThemNox[`${atom}`].push(atomNox);
                                        }
                                    } else {
                                        productsAndThemNox[`${atom}`] = atomNox
                                    }
                                } else {
                                    if(productsAndThemNox[`${atom}`] && productsAndThemNox[`${atom}`] != "x") {
                                        if(typeof productsAndThemNox[`${atom}` == "object"]) {
                                            productsAndThemNox[`${atom}`].push("x");
                                        } else {
                                            const oldValue = productsAndThemNox;
        
                                            productsAndThemNox[`${atom}`] = [];
        
                                            productsAndThemNox[`${atom}`].push(oldValue);
                                            productsAndThemNox[`${atom}`].push("x");
                                        }
                                    } else {
                                        productsAndThemNox[`${atom}`] = "x";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        //

        return { reagentsAndThemNox,productsAndThemNox };
    }
    SolveSimpleEquations(equation) {
        equation = equation.split("=")[0];
        const equationNumbers = [];
    
        for(let i=0;i<equation.length;i++) {
            const currentValue = equation[i], beforeValue = equation[i-1];
            if(currentValue != "x" && currentValue != "+" && currentValue != "-") !beforeValue || beforeValue == "+" ? equationNumbers.push(Number(currentValue)) : equationNumbers.push((Number(currentValue) * (-1)));
        }
        return equationNumbers.reduce((accumulated, currentValue) => accumulated + currentValue)*(-1);
    }
    NoxSolveds(reagentsNox, productsNox) {
        const reagents = [...this.reagents];
        const products = [...this.products];

        const reagentsEquation = reagents.map(elem => {
            const atoms = elem.split("");
            const equation = [];

            for(let i=0;i<atoms.length;i++) {
                const currentValue = atoms[i];
                const nextValue = atoms[i+1];

                if(!this.isThisAtomANumber(currentValue)) {
                    if(this.isThisAtomANumber(nextValue)) {
                        equation.push(reagentsNox[`${currentValue}`]*nextValue);
                    } else {
                        equation.push(reagentsNox[`${currentValue}`]);
                    }
                }else{}
            }
            for(let i=0;i<equation.length;i++) {
                const currentValue = equation[i], nextValue = equation[i+1];
                if(nextValue > 0 || nextValue == "x" && nextValue != undefined) equation[i] = `${currentValue}+`
            }

            return `${equation.join("")}=0`;
        })
        const productsEquation = products.map(elem => {
            const atoms = elem.split("");
            const equation = [];

            for(let i=0;i<atoms.length;i++) {
                const currentValue = atoms[i];
                const nextValue = atoms[i+1];

                if(!this.isThisAtomANumber(currentValue)) {
                    if(this.isThisAtomANumber(nextValue)) {
                        equation.push(productsNox[`${currentValue}`]*nextValue);
                    } else {
                        equation.push(productsNox[`${currentValue}`]);
                    }
                }else{}
            }
            for(let i=0;i<equation.length;i++) {
                const currentValue = equation[i], nextValue = equation[i+1];
                if(nextValue > 0 || nextValue == "x" && nextValue != undefined) equation[i] = `${currentValue}+`
            }

            return `${equation.join("")}=0`;
        })

        const reagentsEquationSolved = reagentsEquation.map(_equation => _equation.includes("x") ? this.SolveSimpleEquations(_equation) : _equation);
        const productsEquationSolved = productsEquation.map(_equation => _equation.includes("x") ? this.SolveSimpleEquations(_equation) : _equation);

        return {
            reagentsEquationSolved: reagentsEquationSolved.filter(elem => typeof elem == "number"),
            productsEquationSolved: productsEquationSolved.filter(elem => typeof elem == "number")
        };
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
}

const firstQuestion = new ChemicalBalancing("NaClO3+H2SO4-->HClO4+ClO2+Na2SO4+H2O");
firstQuestion.Handle();
// Syntax Ex.: C+HNO3-->CO2+NO2+H2O
// NaClO3+H2SO4-->HClO4+ClO2+Na2SO4+H2O

/*
Contexto:

Vai ser feito primeiro um script sem a opcao de fazer balanceamento com 2 atomos iguai no mesmo produto/reagente, depois que o script
for testado, sera feito um update para o novo com esta opcao inclusa.

    Anotacoes sobre:
        Erros a Serem Corrigidos:
            1 - Selecao de elemenros com mais de duas letras --> talvez consertado.
            2 - Dois elementos no mesmo Reagente/Produto --> necessita de conserto.
            3 - X maior que 1.
*/