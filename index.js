const CSVToJSON = require('csvtojson')
const JSONToCSV = require('json2csv').parse
const FileSystem = require('fs')

const CSVFilePath = './csv/cnpjs.csv'
const resultCSVFilePath = './csv/result.csv'

CSVToJSON().fromFile(CSVFilePath).then(source => {
  source.map((row) => { row = validate(row) })
  createCSV(defineCSV(source))
})

function validate(row) {
  row.invalido = ''
  if (!validateCNPJ(row.cnpj)) row.invalido = 'Inválido'
  return row
}

function defineCSV(source) {
  return JSONToCSV(source, { fields: ['nome', 'credenciamento', 'cnpj', 'invalido'] })
}

function createCSV(definedCSV) {
  FileSystem.writeFileSync(resultCSVFilePath, definedCSV)
}

function validateCNPJ(cnpj) {
 
  cnpj = cnpj.replace(/[^\d]+/g,'');

  if(cnpj == '') return false;

  while (cnpj.length < 14) {
    cnpj = '0' + cnpj
  }
   
  if (cnpj.length != 14) return false;

  if (cnpj == "00000000000000" || 
      cnpj == "11111111111111" || 
      cnpj == "22222222222222" || 
      cnpj == "33333333333333" || 
      cnpj == "44444444444444" || 
      cnpj == "55555555555555" || 
      cnpj == "66666666666666" || 
      cnpj == "77777777777777" || 
      cnpj == "88888888888888" || 
      cnpj == "99999999999999")
      return false;
       
  // Valida DVs
  tamanho = cnpj.length - 2
  numeros = cnpj.substring(0,tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
      return false;
       
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
          pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
        return false;
         
  return true;
}
