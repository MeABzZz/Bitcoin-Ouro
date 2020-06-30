/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * TransactionBase
 * auto generated base class for the model TransactionModel.
 */
export const TransactionModelBase = ModelBase
  .named('Transaction')
  .props({
    __typename: types.optional(types.literal("Transaction"), "Transaction"),
    id: types.identifier,
    amount: types.union(types.undefined, types.integer),
    description: types.union(types.undefined, types.string),
    created_at: types.union(types.undefined, types.integer),
    hash: types.union(types.undefined, types.null, types.string),
    type: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class TransactionModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get amount() { return this.__attr(`amount`) }
  get description() { return this.__attr(`description`) }
  get created_at() { return this.__attr(`created_at`) }
  get hash() { return this.__attr(`hash`) }
  get type() { return this.__attr(`type`) }
}
export function selectFromTransaction() {
  return new TransactionModelSelector()
}

export const transactionModelPrimitives = selectFromTransaction().amount.description.created_at.hash.type