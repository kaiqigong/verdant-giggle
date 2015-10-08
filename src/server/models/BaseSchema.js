import {Schema} from 'mongoose';
import {createdModifiedPlugin} from 'mongoose-createdmodified';
import extend from 'mongoose-schema-extend';

const BaseSchema = new Schema();
BaseSchema.plugin(createdModifiedPlugin, {index: true});

export default BaseSchema;
