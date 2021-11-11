const { delay } = require('../../../src/utils');

expect.extend({
    async eventually(source, task, deadlineInSecond = 10, taskRunFreqInSecond = 10) {

        const deadline = new Date().getTime() + (deadlineInSecond * 1000);
        let expectError;

        while (new Date().getTime() < deadline) {
            try {
                await delay(taskRunFreqInSecond * 1000)
            } catch (error) {
            }

            try {
                await task();
                expectError = null;
                break;
            } catch (error) {
                expectError = error;
            }
        }

        if (expectError != null) {
            throw expectError;
        }

        return {
            message: '',
            pass: true
        };
    }
});