export const valueObject = (
  { value, isSelected },
  { type, option: attribute }
) => ({
  value,
  display: String(value),
  id: String(value).replaceAll('^[^a-zA-Z_$]|[^\\w$]', '_'),
  type,
  attribute,
  isIncluded: true,
  isSelected,
  shouldMatch: true,
});

export const textMatchObject = (matchText, isNotMatch, isSelected = false) => ({
  value: 'TEXT_MATCH',
  display: matchText ? matchQueryString(matchText, isNotMatch) : '',
  id: 'text_match',
  isSelected,
});

export const matchQueryString = (matchText = '', isNotMatch) =>
  `${isNotMatch ? 'NOT ' : ''}LIKE '${matchText}'`;

export const generateFilterString = (
  selectedOptions = [],
  conjunctions = [],
  values = [],
  searchTexts = [],
  isOptionNotMatchArr = []
) =>
  selectedOptions.length
    ? selectedOptions
        .map(
          (option, i) =>
            `${queryStringFromSelectedOption(
              option,
              values,
              searchTexts,
              isOptionNotMatchArr
            )} ${i < selectedOptions.length - 1 ? conjunctions[i] : ''}`
        )
        .join(' ')
    : '';

export const queryStringFromSelectedOption = (
  { attribute, optionIndex: oi, matchText, type, valueIndexes },
  values = [],
  searchTexts = [],
  isOptionNotMatchArr = []
) => {
  if (matchText)
    return `${attribute} ${matchQueryString(
      searchTexts[oi],
      isOptionNotMatchArr[oi]
    )}`;
  if (!valueIndexes.length) return '';
  const selectedValues = valueIndexes.map((i) => values[oi][i].value);
  const hasMany = selectedValues.length > 1;
  const encloseIn = type === 'string' ? `'` : '';
  const separator = `${encloseIn}, ${encloseIn}`;
  const operator = [
    ['=', 'IN'],
    ['!=', 'NOT IN'],
  ][+isOptionNotMatchArr[oi]][+hasMany];
  const valuesList = `${hasMany ? '(' : ''}${encloseIn}${selectedValues.join(
    separator
  )}${encloseIn}${hasMany ? ')' : ''}`;
  return `${attribute} ${operator} ${valuesList}`;
};

export const optionsReducer = (
  acc,
  {
    option,
    type = 'string',
    isNotMatch = false,
    matchText = '',
    values: vals = [],
  },
  i
) => {
  acc.open.push(!i);
  acc.notMatchs.push(isNotMatch);
  acc.displayed.push(true);
  acc.loading.push(false);
  acc.srchTxts.push(matchText || '');
  const hasMatchText = !!matchText.trim();
  acc.txtMatchSelected.push(hasMatchText);
  acc.valsShown.push(vals.length > 6 ? 5 : vals.length);

  const { optionValuesArr, valueIndexes } = vals.reduce(
    ({ optionValuesArr, valueIndexes }, v, vi) => {
      optionValuesArr.push(
        valueObject(
          typeof v === 'object'
            ? {
                ...v,
                isSelected: hasMatchText ? false : !!v.isSelected,
              }
            : {
                value: v,
                isSelected: false,
              },
          { type, option }
        )
      );
      if (v.isSelected) valueIndexes.push(vi);
      return { optionValuesArr, valueIndexes };
    },
    {
      optionValuesArr: [],
      valueIndexes: [],
    }
  );
  acc.optionValues.push(optionValuesArr);

  if (hasMatchText) {
    acc.fltrItems.push({
      attribute: option,
      optionIndex: i,
      type,
      matchText,
      valueIndexes: [],
    });
    acc.cnjctns.push('AND');
  } else if (valueIndexes.length) {
    acc.fltrItems.push({
      attribute: option,
      optionIndex: i,
      type,
      matchText: '',
      valueIndexes,
    });
    acc.cnjctns.push('AND');
  }
  return acc;
};
