<template>
    <div class="ddiv">
        <label class="llable">
            <input v-model="view" type="radio" class="iinput" value="table" name="viewType" checked />
            <span class="sspan" :class="{ activetable: view === 'table' }"></span>
        </label>
        <label class="llable">
            <input v-model="view" type="radio" class="iinput" value="grid" name="viewType" />
            <span class="sspan2" :class="{ activegrid: view === 'grid' }"></span>
        </label>
    </div>
</template>