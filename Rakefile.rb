require 'rubygems'
require 'pathname'
require 'colored'

task :cleanup do
  list = Pathname.glob("**/*~") + Pathname.glob("**/*.*~")
  if list.length > 0
    puts "cleared up: ".bold << list.length.to_s.red.bold << " files".bold
    Pathname.send :rm_r, list, :force => true
  else
    puts "no dirty~ files".bold
  end
end

namespace :git do
  task :submodule do
    system "git submodule init"
    system "git submodule update"
    system "git submodule init vendor/sinatra/vendor/rack"
    system "git submodule update vendor/sinatra/vendor/rack"
  end
end
