import handebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

export default class handlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFilecontent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handebars.compile(templateFilecontent);

    return parseTemplate(variables);
  }
}
