require 'rubygems'
require 'pathname'
Pathname.send :alias_method, '/', '+'

DIR = Pathname.new("#{Pathname.new(__FILE__).dirname}/..")

module DomTree
  BookmarkletUrl = "http://localhost:4567/embedded.js"
  class << self
    def root
      DIR
    end
    
    def vendor
      root/'vendor'
    end

    def app
      root/'app'
    end
  end
end

