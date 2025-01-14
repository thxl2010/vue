/* @flow */

import { ASSET_TYPES } from 'shared/constants';
import { isPlainObject, validateComponentName } from '../util/index';

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * 'component': [Vue.component( id, [definition] )](https://cn.vuejs.org/v2/api/#Vue-component)
   * 'directive': [Vue.directive( id, [definition] )](https://cn.vuejs.org/v2/api/#Vue-directive)
   * 'filter': [Vue.filter( id, [definition] )](https://cn.vuejs.org/v2/api/#Vue-filter)
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
