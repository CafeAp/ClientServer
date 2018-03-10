<template>
  <div id="app">
    <div class="left">
      <div class="menu">
        <a href="#menu" class="menu-category" data-toggle="collapse">
          <i class="fa fa-file"></i>
          <span>Меню</span>
        </a>
        <div class="collapse show" id="menu">
          <router-link to="goods">Товары</router-link>
          <router-link to="tech_cards">Тех карты</router-link>
          <router-link to="ingredients">Ингредиенты</router-link>
          <router-link to="goods_categories">Категории товаров и тех карт</router-link>
        </div>

        <a href="#warehouse" class="menu-category" data-toggle="collapse">
          <i class="fa fa-stack-overflow"></i>
          <span>Склад</span>
        </a>
        <div class="collapse show" id="warehouse">
          <router-link to="supplies">Поставки</router-link>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <router-view name="header"/>
      </div>
      <div class="bottom">
        <router-view name="body"/>
      </div>
    </div>
  </div>
</template>

<script>
  import 'bootstrap'

  export default {
    name: 'App',
  };
</script>

<style lang="scss">
  @import "../node_modules/font-awesome/css/font-awesome.min.css";
  @import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
  @import '/assets/styles/variables.scss';

  $left-width: 200px;
  $top-height: 70px;

  html, body, #app {
    height: 100%;
    margin: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .left {
    width: $left-width;
    height: 100%;
    float: left;
    border-right: 1px solid lightgrey;
    .menu {
      margin-top: $top-height;
    }
    .menu-category {
      display: block;
      padding: 10px 15px 0;
      color: darkgrey;
      font-weight: bold;
      font-size: $f-size;
      text-align: left;
      text-decoration: none;
      &:hover {
        color: $f-color;
      }
    }
    .collapse,
    .collapsing {
      a {
        display: block;
        padding: 2px 30px;
        font-size: $f-size - 1px;
        text-align: left;
        text-decoration: none;
        &:hover {
          background: lightgrey;
        }
      }
      .router-link-active {
        background: lightgrey;
        color: $f-color;
        font-weight: bold;
      }
    }
  }
  .right {
    width: calc(100% - 200px);
    margin-left: $left-width;
    height: 100%;
  }
  .top {
    height: 70px;
    border-bottom: 1px solid lightgrey;
  }
  .bottom {
    height: calc(100% - 70px);
    width: 100%;
    padding: 10px;
    overflow: auto;

    .table-sm {
      width: 100%;
      text-align: left;
      td, th {
        padding: 5px 10px;
      }
    }
    .table-row-image {
      display: inline-block;
      width: 100px;
      margin-right: 10px;
    }
    .edit-item-form {
      margin-top: 20px;
      padding-left: 10px;
      width: 600px;

      .form-group {
        &.short {
          width: 200px;
        }
      }
    }
    .buttons {
      float: left;
      margin: 10px;
      button {
        vertical-align: top;
      }
    }

    .alert-mes {
      display: inline-block;
      margin-left: 10px;
    }

  }

  .table-action {
    color: $c-interactive;
    font-size: 18px;
    cursor: pointer;
    opacity: .5;
    transition: opacity .2s;
    &:hover {
      opacity: 1;
    }
    &:not(:last-child) {
      margin-right: 5px;
    }
    &:before {
      vertical-align: middle;
    }
    &.fa-remove {
      position: relative;
      top: -1px;
      font-size: 19px;
      color: $c-danger;
    }
  }
  .sub-items-table-wrapper {
    padding: 10px;
    background: #eee;
    table {
      margin: 10px 0;
      th, td {
        font-size: $f-size;
      }
    }
    .footer {
      padding: 5px 10px;
      border-top: 1px solid lightgrey;
      .exit-weight {
        float: right;
        margin-right: 36%;
        font-size: 13px;
        font-weight: bold;
      }
    }
  }
</style>
