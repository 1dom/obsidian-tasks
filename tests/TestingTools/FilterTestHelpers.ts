import type { FilterOrErrorMessage } from '../../src/Query/Filter/Filter';
import { Task } from '../../src/Task';
import { Query } from '../../src/Query';

/**
 * Convenience function to test a Filter on a single Task
 *
 * @param filter - a FilterOrErrorMessage, which should have a valid Filter.
 * @param task - the Task to filter.
 * @param expected true if the task should match the filter, and false otherwise.
 */
export function testTaskFilter(
    filter: FilterOrErrorMessage,
    task: Task,
    expected: boolean,
) {
    expect(filter.filter).toBeDefined();
    expect(filter.error).toBeUndefined();
    expect(filter.filter!(task)).toEqual(expected);
}

/**
 * Convenience function to test a Filter on a single Task
 *
 * This is to help with porting filter code out of Query and in to Field classes.
 * Unit tests can be first written using the Query class for filtering, and then
 * later updated to use testTaskFilter() instead
 *
 * @param filter - A string, such as 'priority is high'
 * @param task - the Task to filter
 * @param expected - true if the task should match the filter, and false otherwise.
 */
export function testTaskFilterViaQuery(
    filter: string,
    task: Task,
    expected: boolean,
) {
    // Arrange
    const query = new Query({ source: filter });

    const tasks = [task];

    // Act
    let filteredTasks = [...tasks];
    query.filters.forEach((filter) => {
        filteredTasks = filteredTasks.filter(filter);
    });
    const matched = filteredTasks.length === 1;

    // Assert
    expect(matched).toEqual(expected);
}

export type FilteringCase = {
    filters: Array<string>;
    tasks: Array<string>;
    expectedResult: Array<string>;
};

export function shouldSupportFiltering(
    filters: Array<string>,
    allTaskLines: Array<string>,
    expectedResult: Array<string>,
) {
    // Arrange
    const query = new Query({ source: filters.join('\n') });

    const tasks = allTaskLines.map(
        (taskLine) =>
            Task.fromLine({
                line: taskLine,
                sectionStart: 0,
                sectionIndex: 0,
                path: '',
                precedingHeader: '',
            }) as Task,
    );

    // Act
    let filteredTasks = [...tasks];
    query.filters.forEach((filter) => {
        filteredTasks = filteredTasks.filter(filter);
    });

    // Assert
    const filteredTaskLines = filteredTasks.map(
        (task) => `- [ ] ${task.toString()}`,
    );
    expect(filteredTaskLines).toMatchObject(expectedResult);
}
