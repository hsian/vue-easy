<% nameList.forEach(function(item){ %>
import <%= item.camelName -%> from "./<%= item.name -%>";<% }) %>

export default {
    <% nameList.forEach(function(item){ %>
    <%= item.camelName -%>,<% }) %>
}