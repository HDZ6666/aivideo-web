/*
 * @Author: Hewei
 * @Date: 2023-12-14
 * @Description:
 * @LastEditors: Hewei
 * @LastEditTime: 2023-12-13 10:54:48
 */
export const useForm = () => {
    const eformRef = ref(null);
    const formModel = ref({});
    const formConfigs = ref([]);
    const handleValidate = () => {
        return eformRef.value.validate();
    };
    const handleReset = () => {
        return eformRef.value.resetForm();
    };
    return {
        eformRef,
        formModel,
        formConfigs,
        handleValidate,
        handleReset,
    };
};
