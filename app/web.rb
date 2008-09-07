require 'lib/dom_tree'
require DomTree.vendor/'sinatra'/'lib'/'sinatra'

get '/' do
  haml :index
end
