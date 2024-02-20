<template>
  <div class="card p-2">
    <div class="card-header pb-0">
      <slot name="header"></slot>
      <br />
      <div class="row">
        <div :class="entriesClass">
          <div
            class="input-group mb-3 align-items-center"
            v-if="isShowPerPageOption"
          >
            <label class="custom-label--left-side" for="entrySelector"
              >Entries</label
            >
            <select class="form-select" id="entrySelector" v-model="perPage">
              <option v-for="option in perPageOptions" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <div :class="filterClass">
          <slot name="filters"></slot>
        </div>
        <div :class="searchClass">
          <div class="input-group mb-3" v-if="isSearchAble">
            <input
              type="text"
              class="form-control"
              :placeholder="searchPlaceholder"
              id="tableSearch"
              v-model="search"
            />
            <label class="custom-label--right-side" for="tableSearch"
              ><i class="fa fa-search"></i
            ></label>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-5">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                @click="column.sort_key ? sortBy(column.sort_key) : ''"
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                <div
                  class="d-flex flex-row"
                  :style="column.sort_key ? 'cursor: pointer' : ''"
                >
                  {{ column.title }}
                  <span
                    v-if="column.sort_key"
                    :class="sortOrder[column] > 0 ? 'asc' : 'desc'"
                  ></span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-if="data.length && defaultLoop">
            <tr v-for="(item, index) in paginatedData">
              <slot name="table_data" :item="item" :index="index + 1"></slot>
            </tr>
          </tbody>

          <tbody v-if="customLoop">
            <slot name="custom_loop_data"></slot>
          </tbody>

          <tfoot>
            <slot name="table_footer"></slot>
          </tfoot>
        </table>
        <div v-if="!data.length" class="text-center p-5">
          <h5 style="color: #cc3300">
            <b>No Results found!</b>
          </h5>
        </div>
      </div>

      <div
        class="d-flex justify-content-between align-items-center ps-4 pe-4 py-3"
        v-if="pagination && data.length"
      >
        <div class="text-secondary text-xs font-weight-bold">
          Showing {{ currentPage }} of {{ pageCount }} Pages
        </div>

        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="goToPage(currentPage - 1)" href="#"
                >Previous</a
              >
            </li>
            <template v-for="pageNumber in pages">
              <template
                v-if="
                  Math.abs(pageNumber - currentPage) < 3 ||
                  pageNumber == pageCount ||
                  pageNumber == 1
                "
              >
                <li
                  class="page-item"
                  :class="{ active: pageNumber === currentPage }"
                >
                  <a class="page-link" @click="goToPage(pageNumber)" href="#">
                    {{
                      pageNumber == pageCount &&
                      Math.abs(pageNumber - currentPage) > 3
                        ? "..."
                        : null
                    }}
                    {{ pageNumber }}
                    {{
                      pageNumber == 1 && Math.abs(pageNumber - currentPage) > 3
                        ? "..."
                        : null
                    }}
                  </a>
                </li>
              </template>
            </template>
            <li
              class="page-item"
              :class="{ disabled: currentPage === pageCount }"
            >
              <a class="page-link" @click="goToPage(currentPage + 1)" href="#"
                >Next</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <button
      v-if="data.length && csvDownload"
      class="btn btn-default"
      style="position: absolute; bottom: 2px; right: 2px"
      @click="downloadAsCSV()"
    >
      Download CSV
    </button>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    defaultLoop: {
      type: Boolean,
      default: true,
    },
    customLoop: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    perPageOptions: {
      type: Array,
      default: [5, 10, 25, 50, 100],
    },
    data: {
      type: Array,
      default: [],
    },
    isSearchAble: {
      type: Boolean,
      default: true,
    },
    entriesClass: {
      type: String,
      default: "col-md-3",
    },
    searchClass: {
      type: String,
      default: "col-md-5",
    },
    searchPlaceholder: {
      type: String,
      default: "Search",
    },
    filterClass: {
      type: String,
      default: "col-md-4",
    },
    fileName: {
      type: String,
      default: "List",
    },
    isShowPerPageOption: {
      type: Boolean,
      default: true,
    },
    csvDownload: {
      type: Boolean,
      default: true,
    },
    xlsxDownload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      perPage: 5,
      currentPage: 1,
      search: "",
      sortByColumn: "",
      sortOrder: {},
    };
  },
  computed: {
    filteredData() {
      let results = [];
      for (let i = 0; i < this.data.length; i++) {
        let obj = this.data[i];
        for (let key in obj) {
          if (
            String(obj[key])
              .toLowerCase()
              .includes(String(this.search).toLowerCase())
          ) {
            results.push(obj);
            break;
          }
        }
      }
      return results;
    },
    sortedData() {
      if (this.sortByColumn) {
        const order = this.sortOrder[this.sortByColumn];
        return this.filteredData.slice().sort((a, b) => {
          const aVal = a[this.sortByColumn];
          const bVal = b[this.sortByColumn];
          if (aVal === bVal) {
            return 0;
          }
          if (order > 0) {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal > bVal ? -1 : 1;
          }
        });
      } else {
        return this.filteredData;
      }
    },
    pageCount() {
      return Math.ceil(this.filteredData.length / this.perPage);
    },
    pages() {
      const pages = [];
      for (let i = 1; i <= this.pageCount; i++) {
        pages.push(i);
      }
      return pages;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.sortedData.slice(start, end);
    },
  },
  methods: {
    sortBy(column) {
      if (column === this.sortByColumn) {
        this.sortOrder[column] *= -1;
      } else {
        this.sortByColumn = column;
        this.sortOrder[column] = 1;
      }
    },
    goToPage(page) {
      if (page < 1 || page > this.pageCount) return;
      this.currentPage = page;
    },
    downloadAsCSV() {
      const csv = this.generateCSV(this.data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", this.fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },
    generateCSV(data) {
      const headerRow = Object.keys(data[0]).join(",");
      const bodyRows = data.map((obj) => Object.values(obj).join(","));
      return `${headerRow}\n${bodyRows.join("\n")}`;
    },
    downloadAsXLSX() {
      const headerRow = Object.keys(this.data[0])
        .map((key) => `<th>${key}</th>`)
        .join("");
      const bodyRows = this.data
        .map((item) => {
          return `<tr>${Object.values(item)
            .map((value) => `<td>${value}</td>`)
            .join("")}</tr>`;
        })
        .join("");

      // Construct the HTML content of the table
      const tableContent = `
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;

      // Create a Blob with the HTML content
      const blob = new Blob([tableContent], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", this.fileName + ".xlsx");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },
  },
};
</script>
<style scoped>
.asc:before {
  content: "\2191 ";
}

.desc:before {
  content: "\2193 ";
}
</style>
