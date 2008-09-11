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

    def app
      root/'app'
    end
    
    def uri_root
      "http://localhost:4567"
    end
  end
  
  BookmarkletUrl = "#{uri_root}/embedded.js"
end

