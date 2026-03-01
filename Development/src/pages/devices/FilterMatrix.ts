import { cloneDeep, get, has } from 'lodash';

const channelIncludes = (label: any, channelLabelReg: any) =>
    RegExp(channelLabelReg, 'i').test(label);

const filterChannelLabel = (
    channelLabelReg: any,
    item: any,
    getCustomChannelLabel: any
) =>
    !channelLabelReg ||
    Object.entries(item.channels).some(
        ([channelIndex, channelItem]) =>
            channelIncludes((channelItem as any).label, channelLabelReg) ||
            channelIncludes(
                getCustomChannelLabel(channelIndex),
                channelLabelReg
            )
    );

const routableInputsIncludes = (
    inputId: any,
    routableInputsReg: any,
    getInputAPIName: any,
    getInputName: any
) =>
    inputId === null
        ? RegExp(routableInputsReg, 'i').test('Unrouted')
        : RegExp(routableInputsReg, 'i').test(getInputAPIName(inputId)) ||
          RegExp(routableInputsReg, 'i').test(getInputName(inputId));

const filterRoutableInputs = (
    routableInputsReg: any,
    item: any,
    getInputAPIName: any,
    getInputName: any
) =>
    !routableInputsReg ||
    (item.caps.routable_inputs
        ? item.caps.routable_inputs.some((inputId: any) =>
              routableInputsIncludes(
                  inputId,
                  routableInputsReg,
                  getInputAPIName,
                  getInputName
              )
          )
        : RegExp(routableInputsReg, 'i').test('No Constraints'));

const filterName = (nameReg: any, apiName: any, name: any) =>
    !nameReg ||
    RegExp(nameReg, 'i').test(apiName) ||
    RegExp(nameReg, 'i').test(name);

const filterId = (idReg: any, itemId: any) =>
    !idReg || RegExp(idReg, 'i').test(itemId);

const filterBlockSize = (blockSizeVal: any, item: any) =>
    blockSizeVal === undefined ||
    isNaN(blockSizeVal) ||
    item.caps.block_size === blockSizeVal;

const filterReordering = (reorderingVal: any, item: any) =>
    reorderingVal === undefined || item.caps.reordering === reorderingVal;

const filterIOByChannels = (
    channelLabelReg: any,
    filteredIo: any,
    ioResource: any,
    getCustomName: any
) => {
    if (channelLabelReg) {
        for (const [id, item] of Object.entries(filteredIo)) {
            const getCustomChannelLabel = (channelIndex: any) =>
                getCustomName(`${ioResource}.${id}.channels.${channelIndex}`);
            if (
                filterChannelLabel(channelLabelReg, item, getCustomChannelLabel)
            ) {
                filteredIo[id] = cloneDeep(item);
                filteredIo[id].channels = Object.fromEntries(
                    Object.entries(filteredIo[id].channels).filter(
                        ([channelIndex, channelItem]) =>
                            channelIncludes(
                                (channelItem as any).label,
                                channelLabelReg
                            ) ||
                            channelIncludes(
                                getCustomChannelLabel(channelIndex),
                                channelLabelReg
                            )
                    )
                );
            }
        }
    }
};

const hasInputFilters = (filter: any) =>
    has(filter, 'input name') ||
    has(filter, 'input id') ||
    has(filter, 'block size') ||
    has(filter, 'reordering') ||
    has(filter, 'input channel label');

const hasOutputFilters = (filter: any) =>
    has(filter, 'output name') ||
    has(filter, 'output id') ||
    has(filter, 'routable inputs') ||
    has(filter, 'output channel label');

export const getFilteredInputs = (
    filter: any,
    inputs: any,
    getCustomName: any
) => {
    let filteredInputs = inputs;
    if (filter && hasInputFilters(filter)) {
        let inputIdReg = get(filter, 'input id');
        let inputNameReg = get(filter, 'input name');
        let blockSizeVal = get(filter, 'block size');
        let reorderingVal = get(filter, 'reordering');
        let inputChannelLabelReg = get(filter, 'input channel label');
        filteredInputs = Object.fromEntries(
            Object.entries(filteredInputs).filter(
                ([inputId, inputItem]) =>
                    filterId(inputIdReg, inputId) &&
                    filterName(
                        inputNameReg,
                        (inputItem as any).properties.name,
                        getCustomName(`inputs.${inputId}.name`)
                    ) &&
                    filterBlockSize(blockSizeVal, inputItem) &&
                    filterReordering(reorderingVal, inputItem) &&
                    filterChannelLabel(
                        inputChannelLabelReg,
                        inputItem,
                        (channelIndex: any) =>
                            getCustomName(
                                `inputs.${inputId}.channels.${channelIndex}`
                            )
                    )
            )
        );
        filterIOByChannels(
            inputChannelLabelReg,
            filteredInputs,
            'inputs',
            getCustomName
        );
    }
    return filteredInputs;
};

export const getFilteredOutputs = (
    filter: any,
    outputs: any,
    getInputAPIName: any,
    getCustomName: any
) => {
    let filteredOutputs = outputs;
    if (filter && hasOutputFilters(filter)) {
        let outputIdReg = get(filter, 'output id');
        let outputNameReg = get(filter, 'output name');
        let routableInputsReg = get(filter, 'routable inputs');
        let outputChannelLabelReg = get(filter, 'output channel label');
        filteredOutputs = Object.fromEntries(
            Object.entries(filteredOutputs).filter(
                ([outputId, outputItem]) =>
                    filterId(outputIdReg, outputId) &&
                    filterName(
                        outputNameReg,
                        (outputItem as any).properties.name,
                        getCustomName(`outputs.${outputId}.name`)
                    ) &&
                    filterRoutableInputs(
                        routableInputsReg,
                        outputItem,
                        getInputAPIName,
                        (inputId: any) =>
                            getCustomName(`inputs.${inputId}.name`)
                    ) &&
                    filterChannelLabel(
                        outputChannelLabelReg,
                        outputItem,
                        (channelIndex: any) =>
                            getCustomName(
                                `outputs.${outputId}.channels.${channelIndex}`
                            )
                    )
            )
        );
        filterIOByChannels(
            outputChannelLabelReg,
            filteredOutputs,
            'outputs',
            getCustomName
        );
    }
    return filteredOutputs;
};
