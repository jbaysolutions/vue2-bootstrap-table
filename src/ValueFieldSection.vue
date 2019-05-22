<template>
    <span v-if="!enabled" @dblclick="toggleInput" class="editableField">{{this.entry[this.columnname]}}</span>
    <div v-else-if="enabled" class="input-group">
      <input type="text" class="form-control" v-model="datavalue" @keyup.enter="saveThis" @keyup.esc="cancelThis">
      <span class="input-group-btn">
              <button class="btn btn-danger" type="button" @click="cancelThis" ><span class="fa fa-times" aria-hidden="true"></span></button>
              <button class="btn btn-primary" type="button" @click="saveThis" ><span class="fa fa-check" aria-hidden="true"></span></button>
            </span>
    </div>
</template>

<script>
    export default {
        name: "ValueFieldSection",
        props: ['entry','columnname'],
        data: function () {
            return {
                enabled: false,
                datavalue: "",
            }
        },
        methods: {
            saveThis: function () {
                var originalValue = this.entry[this.columnname];
                this.entry[this.columnname] = this.datavalue;
                this.$parent.$emit('cellDataModifiedEvent', originalValue, this.datavalue, this.columnname,  this.entry);
                this.enabled = !this.enabled;
            },
            cancelThis: function () {
                this.datavalue = this.entry[this.columnname];
                this.enabled = !this.enabled;
            },
            toggleInput: function () {
                this.datavalue= this.entry[this.columnname];
                this.enabled=!this.enabled;
            },
        }
    }
</script>

<style scoped>

</style>
