# VDataTable Plugin for Vue 3

A simple Vue 3 data table including sorting, searching, pagination, and CSV download feature also. This data table has multiple customize options also.

### [Demo App URL](https://webartistxyz.github.io/v-datatable-demo/) - Click here to view the live demo of the application.
### [Demo App Source URL](https://github.com/webartistxyz/v-datatable-demo) - https://github.com/webartistxyz/v-datatable-demo.

### Install Plugin

```shell
npm i @webartistxyz/vue-datatable
```

---

## Attention:

#### VDataTable is using bootstrap 5 CSS file. The size of the style.css file is 152kb. But the main file size of the VDataTable is only 10kb. So If you have already included a bootstrap CSS file in your project you don't need to import the VDataTable CSS file. Otherwise, you need to import the CSS file.

```html
<!-- Import css file -->
<style>
    @import "@webartistxyz/vue-datatable/dist/style.css";
</style>
```

---

#### How to use !!!

## Method 1

### Import within a specific component to use only in a component

After installing import the component in your desired file.

```js
import { VDataTable } from "@webartistxyz/vue-datatable"

export default {
    name: "YourComponentName", 
    components: {VDataTable},
    data() {
        return {
            dataSet: [],
            columns: [
                {title: "SL", sort_key: ''}, // We are using sort_key to sort data in ACS order or DESC order. If you don't want to enable the sorting feature then you can keep it an empty string.
                {title: "Name", sort_key: 'title'},
                {title: "Description", sort_key: 'body'},
                {title: "Action", sort_key: ''}
            ],
        };
    },
    mounted() {
        setTimeout(() => {
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then(response => response.json())
                .then(json => {
                    this.dataSet = json;
                })
        }, 1)
    }
};
```

```html
<!-- Component.vue template -->
<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <v-data-table :columns="columns" :data="dataSet">
                    
                    //It's a header slot to show or add anything that you want.
                    <template #header>
                        <div class="d-flex align-items-center justify-content-between">
                            <h6>The header of the list</h6>
                            <button type="button" class="mb-0 btn btn-outline-success btn-sm" @click="">Create data</button>
                        </div>
                    </template>
                    
                    //Scoped slot to show list data in your own way.
                    <template #table_data="{item, index}">
                        <td>
                            <span class="text-secondary text-xs font-weight-bold ps-3">{{ index }}</span>
                        </td>
                        <td>
                            <span class="text-secondary text-xs font-weight-bold ps-3">{{ item.title }}</span>
                        </td>
                        <td>
                            <span class="text-secondary text-xs font-weight-bold ps-3 show-dot-sign">{{ item.body }}</span>
                        </td>
                        <td>
                          <span>
                              <a
                                      href="javascript:;"
                                      class="text-secondary text-xs font-weight-bold ps-3"
                              >Edit</a>
                              <a
                                      href="javascript:;"
                                      class="text-danger text-xs font-weight-bold ps-3"
                              >Delete</a>
                          </span>
                        </td>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>
```

## Method 2

### Import in main.js file to use globally

After installing import the component in your main.js file.

```js
import VDataTable from "@webartistxyz/vue-datatable"

createApp(App).use(VDataTable).mount("#app");
```


---

## Configuration

### Props

| Name                    | Type       | Default                | Description                                                                                                |
|-------------------------|------------|------------------------|------------------------------------------------------------------------------------------------------------|
| **columns**             | `array`    | `[]`                   | Use this to pass your table column names and to control sorting behavior.                                  |
| **pagination**          | `boolean`  | `true`                 | To show or hide the pagination feature.                                                                    |
| **perPageOptions**      | `array`    | `[5, 10, 25, 50, 100]` | You can overwrite this to set your own per-page options.                                                   |
| **data**                | `array`    | `[]`                   | Use this prop to show your data list in the table row.                                                     |
| **isSearchAble**        | `boolean`  | `true`                 | Set false if you want to hid the search field.                                                             |
| **entriesClass**        | `string`   | `col-md-3`             | Use this prop to set your own class for per page select option.                                            |
| **searchClass**         | `string`   | `false`                | Use to show optional word beside the label if your field is optional.                                      |
| **searchPlaceholder**   | `string`   | `'Search'`             | Use this prop to set search input placeholder.                                                             |
| **filterClass**         | `string`   | `col-md-4`             | If you use extra fields between search and per page option the you can use this prop to control this size. |
| **fileName**            | `string`   | `List`                 | Use thi prop to overwrite the name of CSV file.                                                            |
| **isShowPerPageOption** | `boolean`  | `true`                 | Set false if you want to hide per page select option.                                                      |

### Slots

| Name             | Description                                                                          |
|------------------|--------------------------------------------------------------------------------------|
| **header**       | Pass any HTML to show in the table header.                                           |
| **filters**      | Pass any HTML element to show between per page select option and search input field. |
| **table_data**   | This slot is used to show the list in your desired way.                              |
| **table_footer** | Use this slot if you want to use anything in the table footer as tfoot.              |


## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them with clear commit messages.
4. Push your changes to your fork.
5. Open a pull request to the original repository.

## License

MIT © Mohiuddin Sadek (mhddnsadek@gmail.com)