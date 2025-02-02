import type { Task } from '../../Task';
import { Field } from './Field';
import { FilterOrErrorMessage } from './Filter';

/**
 * Support the 'tag' and 'tags' search instructions.
 *
 * Tags can be searched for with and without the hash tag at the start.
 */
export class TagsField extends Field {
    // Handles both ways of referencing the tags query.
    private static readonly tagRegexp =
        /^(tag|tags) (includes|does not include|include|do not include) (.*)/;

    public createFilterOrErrorMessage(line: string): FilterOrErrorMessage {
        const result = new FilterOrErrorMessage();
        const tagMatch = line.match(this.filterRegexp());
        if (tagMatch !== null) {
            const filterMethod = tagMatch[2];

            // Search is done sans the hash. If it is provided then strip it off.
            const search = tagMatch[3].replace(/^#/, '');

            if (filterMethod === 'include' || filterMethod === 'includes') {
                result.filter = (task: Task) =>
                    task.tags.find((tag) =>
                        tag.toLowerCase().includes(search.toLowerCase()),
                    ) !== undefined;
            } else if (
                tagMatch[2] === 'do not include' ||
                tagMatch[2] === 'does not include'
            ) {
                result.filter = (task: Task) =>
                    task.tags.find((tag) =>
                        tag.toLowerCase().includes(search.toLowerCase()),
                    ) == undefined;
            } else {
                result.error = 'do not understand query filter (tag/tags)';
            }
        } else {
            result.error = 'do not understand query filter (tag/tags)';
        }
        return result;
    }

    /**
     * Returns both forms of the field name, singular and plural.
     * @protected
     */
    protected fieldName(): string {
        return 'tag/tags';
    }

    protected filterRegexp(): RegExp {
        return TagsField.tagRegexp;
    }
}
