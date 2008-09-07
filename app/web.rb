require 'rubygems'
require 'pathname'
Pathname.send :alias_method, '/', '+'

DIR = Pathname.new("#{Pathname.new(__FILE__).dirname}/..")

module DomTree
  class << self
    def root
      DIR
    end
    
    def vendor
      root/'vendor'
    end
  end
end

require DomTree.vendor/'sinatra'/'lib'/'sinatra'

get '/' do
  haml "%h1 EUREKA"
end
