/*eslint-disable*/
import ruleService from '../../services/rules.services';
import types from '../actionTypes';

export const fetchProductsByRules = (rules) => (dispatch, getState) => {
    if (getState().ruleData.isFetchingList) {
        return;
    }

    dispatch({
        type: types.FETCH_PRODUCTS_WITH_RULES_REQUEST,
    });

    const {client, type} = getState().clientsData;
    console.log(client, type);

    return ruleService.fetchProductsByRules(client._id, type.key, rules)
        .then((data) => {
            // dispatch({
            //     type: types.FETCH_PRODUCTS_WITH_RULES_SUCCESS,
            //     payload: data,
            // });
            return data;
        })
        .catch((error) => {
            dispatch({
                type: types.FETCH_PRODUCTS_WITH_RULES_FAIL,
                payload: { error },
            });

            throw error;
        });
};

export const fetchProductsByRuleIndex = (entityId, ruleIndex) => (dispatch, getState) => {
    if (getState().ruleData.isFetchingList) {
        return;
    }

    dispatch({
        type: types.FETCH_PRODUCTS_WITH_RULE_REQUEST,
    });

    const { client, type } = getState().clientsData;

    return ruleService.fetchProductsByRuleIndex(client._id, type.key, entityId, ruleIndex)
        .then((data) => {
            dispatch({
                type: types.FETCH_PRODUCTS_WITH_RULE_SUCCESS,
                payload: data,
            });

            return data;
        })
        .catch((error) => {
            dispatch({
                type: types.FETCH_PRODUCTS_WITH_RULE_FAIL,
                payload: { error },
            });

            throw error;
        });
};
