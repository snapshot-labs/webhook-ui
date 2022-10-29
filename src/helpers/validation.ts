import Ajv from 'ajv';

export function validateForm(schema, form) {
  const ajv = new Ajv({ allErrors: true });

  ajv.addFormat('url', {
    validate: value => {
      if (
        !value.match(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        )
      )
        return false;

      return true;
    }
  });

  ajv.validate(schema, form);

  const output = {};
  if (!ajv.errors) {
    return output;
  }

  for (const error of ajv.errors) {
    const path = error.instancePath.split('/').slice(1);

    let current = output;
    for (let i = 0; i < path.length - 1; i++) {
      const subpath = path[i];
      if (!current[subpath]) current[subpath] = {};
      current = current[subpath];
    }

    current[path[path.length - 1]] = 'Invalid field';
  }

  return output;
}
