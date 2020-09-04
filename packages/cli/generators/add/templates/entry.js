<% nameList.forEach(function(item){ %>
import <%= item -%> from "./<%= item -%>";<% }) %>

export default {
    <% nameList.forEach(function(item){ %>
    <%= item -%>,<% }) %>
}